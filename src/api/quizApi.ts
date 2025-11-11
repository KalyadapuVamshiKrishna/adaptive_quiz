// src/api/quizApi.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://adaptive-quiz-api.onrender.com/api/quizzes";

const API = axios.create({
  baseURL: "http://localhost:5000/api/quizzes",
});

// 🔹 1. Get all subjects (topics)
export const fetchSubjects = async () => {
  const res = await API.get("/topics");
  return res.data;
};

// 🔹 2. Get all concepts (flashcards) under a subtopic
export const fetchConceptsBySubtopic = async (subtopicId: string) => {
  const res = await API.get(`/subtopics/${subtopicId}/flashcards`);
  return res.data;
};




export const fetchTopics = async () => {
  const res = await fetch(`${BASE_URL}/topics`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
};



export const startQuizSession = async (topicId: string) => {
  const res = await fetch(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicId }),
  });
  if (!res.ok) throw new Error("Failed to start quiz session");
  return res.json();
};

export const getNextAwarenessCard = async (sessionState: any) => {
  const res = await fetch(`${BASE_URL}/awareness/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionState }),
  });
  if (!res.ok) throw new Error("Failed to fetch next awareness card");
  return res.json();
};

export async function fetchQuestionByRating(flashcardId: string, rating: number) {
  const response = await fetch(
    `${BASE_URL}/flashcards/${flashcardId}/questions/by-rating`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    }
  );

  if (!response.ok) throw new Error("Failed to fetch question");
  return await response.json();
}


export const submitAnswer = async (questionId: string, selectedOption: string, sessionState: any) => {
  const res = await fetch(`${BASE_URL}/questions/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, selectedOption, sessionState }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
};
