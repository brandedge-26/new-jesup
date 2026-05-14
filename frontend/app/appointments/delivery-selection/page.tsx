"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays, Clock, Wrench, ClipboardList, CheckCircle } from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM",  "2:00 PM",
  "3:00 PM",  "4:00 PM",  "5:00 PM",
];

const DAY_NAMES  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  // If it's past 3 PM, start from tomorrow
  const startOffset = now.getHours() >= 15 ? 1 : 0;
  for (let i = startOffset + 1; dates.length < 12; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0) dates.push(d); // skip Sundays
  }
  return dates;
}

function formatDateLabel(d: Date) {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

export default function ReservationPage() {
  const router = useRouter();
  const { update } = useAppointment();

  const availableDates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const canContinue = !!selectedDate && !!selectedTime;

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    update({
      appointmentDate: formatDateLabel(selectedDate),
      appointmentTime: selectedTime,
    });
    router.push("/appointments/customer-details");
  };

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule your appointment</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pick a date and time — come in and our technician will take care of you.
        </p>
      </div>

      {/* What happens at your appointment */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What happens at your appointment</p>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            {
              icon: ClipboardList,
              step: "1",
              title: "You arrive at our store",
              desc: "Bring your device at your scheduled time. Our team will be expecting you.",
            },
            {
              icon: Wrench,
              step: "2",
              title: "Technician meets you",
              desc: "A certified tech will inspect your device, confirm the issue, and walk you through the repair.",
            },
            {
              icon: CheckCircle,
              step: "3",
              title: "We fix it — you approve first",
              desc: "We only proceed with your go-ahead. Most repairs are done the same day.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex items-start gap-4 px-5 py-4">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Select a date
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {availableDates.map((d) => {
            const isSelected =
              selectedDate?.toDateString() === d.toDateString();
            return (
              <button
                key={d.toDateString()}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border-2 transition-all duration-100 focus:outline-none ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                  {DAY_NAMES[d.getDay()]}
                </span>
                <span className={`text-xl font-bold leading-none ${isSelected ? "text-white" : "text-gray-900"}`}>
                  {d.getDate()}
                </span>
                <span className={`text-[10px] font-semibold ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                  {MONTH_NAMES[d.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time picker */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Select a time
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-100 focus:outline-none ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected slot confirmation */}
      {canContinue && (
        <div className="mb-6 rounded-xl bg-primary/5 border border-primary/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/10">
            <CalendarDays className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Your appointment is set for</p>
              <p className="text-sm font-bold text-gray-900">
                {formatDateLabel(selectedDate!)} &bull; {selectedTime}
              </p>
            </div>
          </div>
          <p className="px-4 py-2.5 text-xs text-primary/80 font-medium">
            A Jesup technician will be ready to meet you at this time. Please arrive on time with your device.
          </p>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <Link
          href="/appointments/damage-type"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
            canContinue
              ? "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
