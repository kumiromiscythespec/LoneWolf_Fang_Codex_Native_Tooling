// BUILD_ID: 20260612_fasttrack_window4_closed_loop_state_machine_v0
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const BUILD_ID = "20260612_fasttrack_window4_closed_loop_state_machine_v0";
export const PLAN_SCHEMA = "lonewolf.codex_native.closed_loop_state.plan.v0";
export const FIXTURE_BUILD_ID = "20260612_fasttrack_window4_closed_loop_state_machine_fixture_v0";

export const STATES = Object.freeze([
  "NO_TASK",
  "TASK_AUTHORED",
  "VALIDATOR_ACCEPTED",
  "VALIDATOR_REJECTED",
  "INTERPRETER_COMPLETED",
  "REVIEW_PACKET_CREATED",
  "OWNER_DECISION_REQUIRED",
  "LINKAGE_PROOF_CREATED",
  "CLOSED_OUT",
  "STOP_OWNER_REVIEW_REQUIRED"
]);

export const EVENTS = Object.freeze([
  "task_found",
  "validation_passed",
  "validation_failed",
  "interpreter_completed",
  "review_packet_ready",
  "owner_go",
  "owner_repair",
  "linkage_proof_ready",
  "closeout_ready",
  "unsafe_condition"
]);

const PHASES = Object.freeze({
  manualValidatorReview: "manual_validator_review",
  ownerReviewBeforeInterpreter: "owner_review_before_interpreter",
  manualRepairReview: "manual_repair_review",
  manualReviewPacketCreation: "manual_review_packet_creation",
  ownerDecisionGate: "owner_decision_gate",
  manualLinkageProofCreation: "manual_linkage_proof_creation",
  manualCloseoutReview: "manual_closeout_review",
  closedLoopComplete: "closed_loop_complete",
  stopOwnerReviewRequired: "stop_owner_review_required"
});

const allowedTransitions = new Map([
  transition("NO_TASK", "task_found", "TASK_AUTHORED", PHASES.manualValidatorReview, true),
  transition(
    "TASK_AUTHORED",
    "validation_passed",
    "VALIDATOR_ACCEPTED",
    PHASES.ownerReviewBeforeInterpreter,
    true
  ),
  transition("TASK_AUTHORED", "validation_failed", "VALIDATOR_REJECTED", PHASES.manualRepairReview, true),
  transition("VALIDATOR_REJECTED", "owner_repair", "TASK_AUTHORED", PHASES.manualValidatorReview, true),
  transition(
    "VALIDATOR_ACCEPTED",
    "interpreter_completed",
    "INTERPRETER_COMPLETED",
    PHASES.manualReviewPacketCreation,
    true
  ),
  transition(
    "INTERPRETER_COMPLETED",
    "review_packet_ready",
    "REVIEW_PACKET_CREATED",
    PHASES.ownerDecisionGate,
    true
  ),
  transition(
    "REVIEW_PACKET_CREATED",
    "owner_go",
    "OWNER_DECISION_REQUIRED",
    PHASES.manualLinkageProofCreation,
    true
  ),
  transition("REVIEW_PACKET_CREATED", "owner_repair", "TASK_AUTHORED", PHASES.manualRepairReview, true),
  transition("OWNER_DECISION_REQUIRED", "owner_repair", "TASK_AUTHORED", PHASES.manualRepairReview, true),
  transition(
    "OWNER_DECISION_REQUIRED",
    "linkage_proof_ready",
    "LINKAGE_PROOF_CREATED",
    PHASES.manualCloseoutReview,
    true,
    { requiresOwnerDecisionEvidence: true }
  ),
  transition("LINKAGE_PROOF_CREATED", "closeout_ready", "CLOSED_OUT", PHASES.closedLoopComplete, false)
]);

const unsafeEvidenceKeys = new Set([
  "auto_continue",
  "auto_execute",
  "auto_execute_enabled",
  "billing_mutation",
  "calls_helper",
  "calls_interpreter",
  "calls_validator",
  "cleanup",
  "daemon_enabled",
  "delete_files",
  "deploy",
  "execution_allowed",
  "fetch_balance",
  "force_push",
  "helper_execution",
  "interpreter_execution",
  "ledger_mutation",
  "mutates_ledger",
  "mutates_queue",
  "openai_api",
  "paper_live_order",
  "private_api",
  "prompt_sending_allowed",
  "pull",
  "push",
  "queue_mutation",
  "real_orchestration_allowed",
  "reset",
  "restore",
  "runtime_execution",
  "runtime_execution_allowed",
  "secrets_output",
  "task_execution",
  "task_execution_allowed",
  "validator_execution",
  "watcher_enabled",
  "worker_launch_allowed"
]);

function transition(currentState, event, nextState, allowedNextPhase, ownerApprovalRequired, options = {}) {
  return [
    `${currentState}:${event}`,
    {
      currentState,
      event,
      nextState,
      allowedNextPhase,
      ownerApprovalRequired,
      ...options
    }
  ];
}

function isKnownState(state) {
  return STATES.includes(state);
}

function isKnownEvent(event) {
  return EVENTS.includes(event);
}

function plan({ currentState, event, nextState, allowedNextPhase, ownerApprovalRequired, reason }) {
  return {
    schema: PLAN_SCHEMA,
    build_id: FIXTURE_BUILD_ID,
    current_state: currentState,
    event,
    next_state: nextState,
    allowed_next_phase: allowedNextPhase,
    execution_allowed: false,
    owner_approval_required: ownerApprovalRequired,
    reason
  };
}

function stopPlan(currentState, event, reason) {
  return plan({
    currentState: isKnownState(currentState) ? currentState : "STOP_OWNER_REVIEW_REQUIRED",
    event: isKnownEvent(event) ? event : "unsafe_condition",
    nextState: "STOP_OWNER_REVIEW_REQUIRED",
    allowedNextPhase: PHASES.stopOwnerReviewRequired,
    ownerApprovalRequired: true,
    reason
  });
}

function hasUnsafeEvidence(value) {
  if (value === null || typeof value !== "object") return false;
  for (const [key, nested] of Object.entries(value)) {
    if (unsafeEvidenceKeys.has(key) && nested === true) return true;
    if (hasUnsafeEvidence(nested)) return true;
  }
  return false;
}

function hasOwnerDecisionEvidence(evidence) {
  if (evidence === null || typeof evidence !== "object") return false;
  return evidence.owner_decision_recorded === true || evidence.owner_go === true || evidence.owner_decision === "GO";
}

export function classifyClosedLoopState(input = {}) {
  const currentState = input.current_state ?? input.currentState;
  const event = input.event;
  const evidence = input.evidence ?? {};

  if (!isKnownState(currentState)) {
    return stopPlan(currentState, "unsafe_condition", `Unknown or missing current_state: ${String(currentState)}`);
  }

  if (!isKnownEvent(event)) {
    return stopPlan(currentState, event, `Unknown or missing event: ${String(event)}`);
  }

  if (event === "unsafe_condition") {
    return stopPlan(currentState, event, "Unsafe condition event requires owner review before any continuation.");
  }

  if (input.execution_allowed === true || hasUnsafeEvidence(evidence)) {
    return stopPlan(
      currentState,
      event,
      "Input evidence attempts or implies execution, mutation, automation, or other forbidden behavior."
    );
  }

  const transitionRecord = allowedTransitions.get(`${currentState}:${event}`);
  if (!transitionRecord) {
    return stopPlan(currentState, event, `Illegal or ambiguous transition ${currentState} --${event}--> unknown.`);
  }

  if (transitionRecord.requiresOwnerDecisionEvidence && !hasOwnerDecisionEvidence(evidence)) {
    return stopPlan(
      currentState,
      event,
      "Linkage proof requires explicit owner decision evidence; missing or ambiguous owner evidence fails closed."
    );
  }

  return plan({
    currentState,
    event,
    nextState: transitionRecord.nextState,
    allowedNextPhase: transitionRecord.allowedNextPhase,
    ownerApprovalRequired: transitionRecord.ownerApprovalRequired,
    reason: `Manual evidence transition accepted: ${currentState} --${event}--> ${transitionRecord.nextState}. This plan does not execute the next phase.`
  });
}

function parseArgs(argv) {
  const args = { metadata: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--metadata") {
      args.metadata = argv[++index] ?? null;
    } else if (item === "--help" || item === "-h") {
      args.help = true;
    } else {
      args.unknown = item;
    }
  }
  return args;
}

function usage() {
  return [
    "Usage: node tools/orchestration/codex_native_closed_loop_state_machine.mjs --metadata <metadata_json_path>",
    "Reads local metadata and prints a plan object. It never executes a phase or writes files."
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return 0;
  }
  if (args.unknown) {
    console.error(`SAFE_ERROR: unknown argument ${args.unknown}`);
    console.error(usage());
    return 2;
  }
  if (!args.metadata) {
    console.error("SAFE_ERROR: --metadata is required.");
    console.error(usage());
    return 2;
  }

  let metadata;
  try {
    metadata = JSON.parse(readFileSync(resolve(args.metadata), "utf8"));
  } catch (error) {
    console.log(JSON.stringify(stopPlan("STOP_OWNER_REVIEW_REQUIRED", "unsafe_condition", error.message), null, 2));
    return 1;
  }

  const result = classifyClosedLoopState(metadata);
  console.log(JSON.stringify(result, null, 2));
  return result.next_state === "STOP_OWNER_REVIEW_REQUIRED" ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
