export const getDriverRating = (score: number) => {
  if (score >= 95) return "Excellent Driver";
  if (score >= 85) return "Good Driver";
  if (score >= 70) return "Average Driver";

  return "Needs Improvement";
};
