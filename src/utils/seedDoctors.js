const mongoose = require("mongoose");
const Doctor = require("../models/doctors");
require("dotenv").config();
const connectDB = require("../config/database");

// Sample doctor data
const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      location: "Mumbai",
      experience: "12 years",
      rating: 4.8,
      fee: 800,
      status: "Available Now",
      languages: ["English", "Hindi", "Marathi"],
      nextAvailable: "2025-09-22T14:30:00.000Z",
    },
    {
      name: "Dr. Michael Anderson",
      specialization: "Dermatologist",
      location: "Delhi",
      experience: "8 years",
      rating: 4.7,
      fee: 600,
      status: "Busy",
      languages: ["English", "Hindi", "Gujarati"],
      nextAvailable: "2025-09-23T10:00:00.000Z",
    },
    {
      name: "Dr. Emily Davis",
      specialization: "General Physician",
      location: "Bangalore",
      experience: "6 years",
      rating: 4.6,
      fee: 500,
      status: "Available Now",
      languages: ["English", "Hindi", "Kannada"],
      nextAvailable: "2025-09-22T16:00:00.000Z",
    },
    {
      name: "Dr. Robert Wilson",
      specialization: "Orthopedic Surgeon",
      location: "Hyderabad",
      experience: "15 years",
      rating: 4.9,
      fee: 1200,
      status: "Available Now",
      languages: ["English", "Hindi", "Telugu"],
      nextAvailable: "2025-09-22T18:00:00.000Z",
    },
    {
      name: "Dr. Sophia Martinez",
      specialization: "Pediatrician",
      location: "Chennai",
      experience: "10 years",
      rating: 4.7,
      fee: 700,
      status: "Busy",
      languages: ["English", "Hindi", "Tamil"],
      nextAvailable: "2025-09-23T11:30:00.000Z",
    },
    {
      name: "Dr. William Thompson",
      specialization: "Neurologist",
      location: "Pune",
      experience: "18 years",
      rating: 4.9,
      fee: 1500,
      status: "Available Now",
      languages: ["English", "Hindi", "Marathi"],
      nextAvailable: "2025-09-22T17:00:00.000Z",
    },
    {
      name: "Dr. Olivia Brown",
      specialization: "Gynecologist",
      location: "Kolkata",
      experience: "9 years",
      rating: 4.6,
      fee: 650,
      status: "Available Now",
      languages: ["English", "Hindi", "Bengali"],
      nextAvailable: "2025-09-22T19:30:00.000Z",
    },
    {
      name: "Dr. Daniel Evans",
      specialization: "Psychiatrist",
      location: "Cochin",
      experience: "11 years",
      rating: 4.8,
      fee: 900,
      status: "Busy",
      languages: ["English", "Hindi", "Malayalam"],
      nextAvailable: "2025-09-23T09:30:00.000Z",
    },
    {
      name: "Dr. Chloe Taylor",
      specialization: "Dentist",
      location: "Nagpur",
      experience: "7 years",
      rating: 4.5,
      fee: 400,
      status: "Available Now",
      languages: ["English", "Hindi", "Marathi"],
      nextAvailable: "2025-09-22T15:15:00.000Z",
    },
    {
      name: "Dr. James Miller",
      specialization: "ENT Specialist",
      location: "Visakhapatnam",
      experience: "13 years",
      rating: 4.7,
      fee: 750,
      status: "Available Now",
      languages: ["English", "Hindi", "Telugu"],
      nextAvailable: "2025-09-22T14:45:00.000Z",
    },
    {
      name: "Dr. Laura Green",
      specialization: "Ophthalmologist",
      location: "Jaipur",
      experience: "9 years",
      rating: 4.6,
      fee: 700,
      status: "Available Now",
      languages: ["English", "Hindi"],
      nextAvailable: "2025-09-22T16:30:00.000Z",
    },
    {
      name: "Dr. Anthony King",
      specialization: "Urologist",
      location: "Ahmedabad",
      experience: "14 years",
      rating: 4.8,
      fee: 950,
      status: "Busy",
      languages: ["English", "Hindi", "Gujarati"],
      nextAvailable: "2025-09-23T12:00:00.000Z",
    },
    {
      name: "Dr. Megan Scott",
      specialization: "Endocrinologist",
      location: "Bhubaneswar",
      experience: "10 years",
      rating: 4.7,
      fee: 850,
      status: "Available Now",
      languages: ["English", "Hindi", "Odia"],
      nextAvailable: "2025-09-22T17:45:00.000Z",
    },
    {
      name: "Dr. Ethan White",
      specialization: "Gastroenterologist",
      location: "Kochi",
      experience: "12 years",
      rating: 4.9,
      fee: 1000,
      status: "Busy",
      languages: ["English", "Hindi", "Malayalam"],
      nextAvailable: "2025-09-23T11:00:00.000Z",
    },
  ];
  

const seedDoctors = async () => {
  try {
    await connectDB();                 // Connect to MongoDB
    await Doctor.deleteMany();         // Clear existing doctors
    await Doctor.insertMany(doctors);  // Insert seed data
    console.log(" Doctors seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDoctors();
