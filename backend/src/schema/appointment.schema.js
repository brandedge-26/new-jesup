import { z } from "zod";

export const createAppointmentSchema = z.object({
    // DEVICE
    deviceType: z.string().min(1, "Device type is required"),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),

    // DAMAGE
    damageTypes: z.array(z.string()).min(1, "At least one damage type is required"),
    damageDescription: z.string().optional(),

    // SCHEDULE
    appointmentDate: z.string().min(1, "Appointment date is required"),
    appointmentTime: z.string().min(1, "Appointment time is required"),

    // LOCATION
    zipCode: z.string().optional(),
    streetAddress: z.string().optional(),
    location: z
        .object({ lat: z.number(), lng: z.number(), display: z.string() })
        .nullable()
        .optional(),

    // CUSTOMER
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    marketingOptIn: z.boolean().optional(),
});
