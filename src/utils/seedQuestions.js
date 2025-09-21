const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/questions");

dotenv.config();

const questions = [
  // --- Category: Symptoms & Identification ---
  {
    category: "Symptoms & Identification",
    question: "How often do you experience irregular menstrual cycles (longer than 35 days or fewer than 8 cycles a year)?",
    options: [
      { option: "Often", value: "irregular" },
      { option: "Sometimes", value: "sometimes" },
      { option: "Rarely", value: "rarely" }
    ]
  },
  {
    category: "Symptoms & Identification",
    question: "Do you experience heavy or prolonged bleeding during your periods?",
    options: [
      { option: "Yes, heavy/prolonged", value: "heavy" },
      { option: "No, normal", value: "normal" }
    ]
  },
  {
    category: "Symptoms & Identification",
    question: "Have you noticed unusual hair growth on your face, chest, back, or abdomen?",
    options: [
      { option: "Yes", value: "hirsutism_yes" },
      { option: "No", value: "hirsutism_no" }
    ]
  },
  {
    category: "Symptoms & Identification",
    question: "Do you experience sudden or severe acne breakouts?",
    options: [
      { option: "Yes", value: "acne_yes" },
      { option: "No", value: "acne_no" }
    ]
  },

  // --- Category: Lifestyle & Habits ---
  {
    category: "Lifestyle & Habits",
    question: "How often do you exercise in a week?",
    options: [
      { option: "5 or more days", value: "exercise_high" },
      { option: "2-4 days", value: "exercise_medium" },
      { option: "Rarely/Never", value: "exercise_low" }
    ]
  },
  {
    category: "Lifestyle & Habits",
    question: "How would you describe your sleep quality?",
    options: [
      { option: "Good (7-8 hours, restful)", value: "sleep_good" },
      { option: "Average (5-6 hours, sometimes restless)", value: "sleep_average" },
      { option: "Poor (less than 5 hours or very disturbed)", value: "sleep_poor" }
    ]
  },
  {
    category: "Lifestyle & Habits",
    question: "How often do you consume processed/junk food?",
    options: [
      { option: "Frequently", value: "junk_often" },
      { option: "Sometimes", value: "junk_sometimes" },
      { option: "Rarely", value: "junk_rarely" }
    ]
  },

  // --- Category: Mental & Emotional Wellbeing ---
  {
    category: "Mental & Emotional Wellbeing",
    question: "How often do you feel anxious or experience anxiety attacks?",
    options: [
      { option: "Often", value: "anxiety_often" },
      { option: "Sometimes", value: "anxiety_sometimes" },
      { option: "Rarely", value: "anxiety_rarely" }
    ]
  },
  {
    category: "Mental & Emotional Wellbeing",
    question: "Do you feel stressed about your body image or weight?",
    options: [
      { option: "Yes", value: "stress_yes" },
      { option: "No", value: "stress_no" }
    ]
  },
  {
    category: "Mental & Emotional Wellbeing",
    question: "How often do you feel mood swings or sudden changes in emotions?",
    options: [
      { option: "Often", value: "mood_often" },
      { option: "Sometimes", value: "mood_sometimes" },
      { option: "Rarely", value: "mood_rarely" }
    ]
  },

  // --- Category: Medical History ---
  {
    category: "Medical History",
    question: "Do you have a family history of PCOD/PCOS?",
    options: [
      { option: "Yes", value: "family_yes" },
      { option: "No", value: "family_no" },
      { option: "Not sure", value: "family_unknown" }
    ]
  },
  {
    category: "Medical History",
    question: "Have you been diagnosed with diabetes or prediabetes?",
    options: [
      { option: "Yes", value: "diabetes_yes" },
      { option: "No", value: "diabetes_no" }
    ]
  },
  {
    category: "Medical History",
    question: "Have you ever experienced fertility issues or difficulty conceiving?",
    options: [
      { option: "Yes", value: "fertility_yes" },
      { option: "No", value: "fertility_no" }
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    console.log("🌐 Connected to MongoDB");
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log("✅ Questions seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding questions:", err);
    process.exit(1);
  }
});
