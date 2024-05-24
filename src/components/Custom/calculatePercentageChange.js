export const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 100;
    const change = ((current - previous) / previous) * 100;
    return isNaN(change) ? 100 : change.toFixed(2);
  };