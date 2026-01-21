import { connectDB } from "@/server/db/connect";
import Availability, {
  IAvailability,
  IAvailabilityDay,
} from "@/server/models/Availability";
import { AppError } from "@/utils/appError";

const get = async (employeeId: string): Promise<IAvailability | null> => {
  await connectDB();
  try {
    const data = await Availability.findOne({ employeeId });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw new AppError("Failed to fetch availability");
  }
};

const update = async (
  accountId: string,
  employeeId: string,
  days: IAvailabilityDay[],
): Promise<IAvailability> => {
  await connectDB();
  try {
    const data = await Availability.findOneAndUpdate(
      { employeeId },
      {
        $set: {
          accountId, // Ensure accountID is set/updated
          days,
          lastUpdated: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error updating availability:", error);
    throw new AppError("Failed to update availability");
  }
};

const getForEmployees = async (
  employeeIds: string[],
): Promise<IAvailability[]> => {
  await connectDB();
  try {
    const data = await Availability.find({ employeeId: { $in: employeeIds } });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching availabilities:", error);
    throw new AppError("Failed to fetch availabilities");
  }
};

export const AvailabilityService = { get, update, getForEmployees };
