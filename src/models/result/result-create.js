import EventResult from "./event-result";
import EffectResult from "./effect-result";
import MessageResult from "./message-result";
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
    case "saving-throw":
      return new SavingThrowResult(data);
    case "accident-check":
      return new AccidentCheckResult(data);
    case "accident":
      return new AccidentResult(data);
    case "message":
      return new MessageResult(data);
    case "choice":
      return new ChoiceResult(data);
    case "effect":
    default:
      return new EffectResult({ type: "effect", ...data });
  }
}

export default resultCreate;
