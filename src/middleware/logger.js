export const logAsk = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.originalUrl.includes("/api/ask")) {
      const latency = Date.now() - start;

      console.log({
        userId: req.user?.id,
        question: req.body?.question?.slice(0, 50),
        latencyMs: latency,
        confidence: res.locals?.confidence || "unknown",
      });
    }
  });

  next();
};