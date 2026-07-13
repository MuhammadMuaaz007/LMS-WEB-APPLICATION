export async function generateLast12MonthData(model) {
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
        const currentDate = new Date();
        // 1. Set the end date for the specific month iteration
        // We set the date to the current date, but subtract 'i' months
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, currentDate.getDate(), 23, 59, 59, 999 // CRITICAL: Force time to the end of the day
        );
        // 2. Set the start date exactly 1 month prior to the endDate
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate(), 0, 0, 0, 0 // Force time to the start of that day
        );
        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        });
        last12Months.push({ month: monthYear, count });
    }
    return { last12Months };
}
