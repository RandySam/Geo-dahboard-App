import {
  useAnalysisStore,
} from "../stores/analysisStore";

export default function RunAnalysisButton() {
  const {
    runAnalysis,

    loading,
  } = useAnalysisStore();

  const handleRunAnalysis =
    async () => {
      await runAnalysis(
        3,
        "Analisis KMeans Kota Bekasi"
      );
    };

  return (
    <button
      className="run-analysis-button"
      disabled={loading}
      onClick={
        handleRunAnalysis
      }
    >
      {loading
        ? "Memproses..."
        : "Jalankan Analisis"}
    </button>
  );
}