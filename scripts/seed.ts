import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI was not found in .env.local");
}

const client = new MongoClient(uri);

import type { Airport, Schedule } from "../lib/types";

const airports: Airport[] = [
  {
    code: "NZNE",
    name: "Dairy Flat Airport",
    city: "Auckland",
    timezone: "Pacific/Auckland",
  },
  {
    code: "YSSY",
    name: "Sydney Airport",
    city: "Sydney",
    timezone: "Australia/Sydney",
  },
  {
    code: "NZRO",
    name: "Rotorua Airport",
    city: "Rotorua",
    timezone: "Pacific/Auckland",
  },
  {
    code: "NZGB",
    name: "Claris Airport",
    city: "Great Barrier Island",
    timezone: "Pacific/Auckland",
  },
  {
    code: "NZCI",
    name: "Tuuta Airport",
    city: "Chatham Islands",
    timezone: "Pacific/Chatham",
  },
  {
    code: "NZTL",
    name: "Lake Tekapo Airport",
    city: "Lake Tekapo",
    timezone: "Pacific/Auckland",
  },
];

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function setTime(date: Date, hour: number, minute: number) {
  const copy = new Date(date);
  copy.setHours(hour, minute, 0, 0);
  return copy;
}

function createSchedule(
  flightNo: string,
  origin: string,
  destination: string,
  departure: Date,
  arrival: Date,
  aircraft: string,
  capacity: number,
  price: number
): Schedule {
  return {
    flightNo,
    origin,
    destination,
    departureTime: departure.toISOString(),
    arrivalTime: arrival.toISOString(),
    aircraft,
    capacity,
    price,
    bookings: [],
  };
}

function generateSchedules() {
  const schedules: Schedule[] = [];

  const startDate = new Date("2026-06-01T00:00:00");
  const numberOfWeeks = 8;

  for (let week = 0; week < numberOfWeeks; week++) {
    const monday = addDays(startDate, week * 7);

    // Sydney prestige service: Friday outbound, Sunday return
    const friday = addDays(monday, 4);
    const sunday = addDays(monday, 6);

    schedules.push(
      createSchedule(
        `DF${100 + week}`,
        "NZNE",
        "YSSY",
        setTime(friday, 10, 30),
        setTime(friday, 13, 30),
        "SyberJet SJ30i",
        6,
        1299
      )
    );

    schedules.push(
      createSchedule(
        `DF${200 + week}`,
        "YSSY",
        "NZNE",
        setTime(sunday, 15, 30),
        setTime(sunday, 20, 45),
        "SyberJet SJ30i",
        6,
        1299
      )
    );

    // Rotorua shuttle: twice every weekday
    for (let day = 0; day < 5; day++) {
      const weekday = addDays(monday, day);

      schedules.push(
        createSchedule(
          `DF${300 + week * 10 + day}`,
          "NZNE",
          "NZRO",
          setTime(weekday, 7, 30),
          setTime(weekday, 8, 15),
          "Cirrus SF50",
          4,
          249
        )
      );

      schedules.push(
        createSchedule(
          `DF${400 + week * 10 + day}`,
          "NZRO",
          "NZNE",
          setTime(weekday, 8, 45),
          setTime(weekday, 9, 30),
          "Cirrus SF50",
          4,
          249
        )
      );

      schedules.push(
        createSchedule(
          `DF${500 + week * 10 + day}`,
          "NZNE",
          "NZRO",
          setTime(weekday, 16, 30),
          setTime(weekday, 17, 15),
          "Cirrus SF50",
          4,
          249
        )
      );

      schedules.push(
        createSchedule(
          `DF${600 + week * 10 + day}`,
          "NZRO",
          "NZNE",
          setTime(weekday, 18, 0),
          setTime(weekday, 18, 45),
          "Cirrus SF50",
          4,
          249
        )
      );
    }

    // Great Barrier Island: outbound Mon/Wed/Fri, return Tue/Thu/Sat
    [0, 2, 4].forEach((day, index) => {
      const date = addDays(monday, day);
      schedules.push(
        createSchedule(
          `DF${700 + week * 10 + index}`,
          "NZNE",
          "NZGB",
          setTime(date, 9, 0),
          setTime(date, 9, 35),
          "Cirrus SF50",
          4,
          199
        )
      );
    });

    [1, 3, 5].forEach((day, index) => {
      const date = addDays(monday, day);
      schedules.push(
        createSchedule(
          `DF${730 + week * 10 + index}`,
          "NZGB",
          "NZNE",
          setTime(date, 10, 0),
          setTime(date, 10, 35),
          "Cirrus SF50",
          4,
          199
        )
      );
    });

    // Chatham Islands: outbound Tue/Fri, return Wed/Sat
    [1, 4].forEach((day, index) => {
      const date = addDays(monday, day);
      schedules.push(
        createSchedule(
          `DF${800 + week * 10 + index}`,
          "NZNE",
          "NZCI",
          setTime(date, 10, 0),
          setTime(date, 13, 45),
          "HondaJet Elite",
          5,
          899
        )
      );
    });

    [2, 5].forEach((day, index) => {
      const date = addDays(monday, day);
      schedules.push(
        createSchedule(
          `DF${830 + week * 10 + index}`,
          "NZCI",
          "NZNE",
          setTime(date, 14, 30),
          setTime(date, 18, 0),
          "HondaJet Elite",
          5,
          899
        )
      );
    });

    // Lake Tekapo: Monday outbound, Tuesday return
    const tuesday = addDays(monday, 1);

    schedules.push(
      createSchedule(
        `DF${900 + week}`,
        "NZNE",
        "NZTL",
        setTime(monday, 11, 0),
        setTime(monday, 12, 30),
        "HondaJet Elite",
        5,
        599
      )
    );

    schedules.push(
      createSchedule(
        `DF${950 + week}`,
        "NZTL",
        "NZNE",
        setTime(tuesday, 13, 30),
        setTime(tuesday, 15, 0),
        "HondaJet Elite",
        5,
        599
      )
    );
  }

  return schedules;
}

async function seed() {
  try {
    await client.connect();

    const db = client.db("airline-booking");

    await db.collection("airports").deleteMany({});
    await db.collection("schedules").deleteMany({});

    const schedules = generateSchedules();

    await db.collection("airports").insertMany(airports);
    await db.collection("schedules").insertMany(schedules);

    console.log(`Seed complete.`);
    console.log(`Inserted ${airports.length} airports.`);
    console.log(`Inserted ${schedules.length} schedules.`);
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await client.close();
  }
}

seed();