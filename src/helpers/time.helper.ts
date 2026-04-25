import dayjs, { ManipulateType } from "dayjs";

class TimeHelper {
  public subtractByParams(value: number, unit: ManipulateType): Date {
    return dayjs().subtract(value, unit).toDate();
  }

  public parseConfigString(string: string): {
    value: number;
    unit: ManipulateType;
  } {
    const parts = string.trim().split(" ");
    if (parts.length !== 2) {
      return { value: 30, unit: "days" as ManipulateType };
    }
    return { value: parseInt(parts[0]), unit: parts[1] as ManipulateType };
  }
}

export const timeHelper = new TimeHelper();
