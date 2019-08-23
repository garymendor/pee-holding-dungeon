import EventResult from "./event-result";
import EffectResult from "./effect-result";
import MessageResult from "./message-result";
import ChanceResult from "./chance-result";
import ChoiceResult from "./choice-result";
import StatCheckResult from "./stat-check-result";
import SavingThrowResult from "./saving-throw-result";
import AccidentCheckResult from "./accident-check-result";
import AccidentResult from "./accident-result";

function resultCreate(data) {
  if (typeof data === "string") {
    return new EventResult({ type: "event", event: data });
  }

  switch (data.type) {
    case "stat-check":
      return new StatCheckResult(data);
    case "savingThrow":
      return new SavingThrowResult(data);
    case "accident-check":
      return new AccidentCheckResult(data);
    case "accident":
      return new AccidentResult(data);
    case "message":
      return new MessageResult(data);
    case "chance":
      return new ChanceResult(data);
    case "choice":
      return new ChoiceResult(data);
    case "event":
      return new EventResult(data);
    case "effect":
    default:
      if (data.message) {
        return new MessageResult({ type: "message", ...data });
      }
      if (data.name) {
        return new EffectResult({ type: "effect", ...data });
      }
      return new MessageResult({
        type: "message",
        message: `Result type not supported: ${JSON.stringify(data)}`
      });
  }
}

export default resultCreate;
