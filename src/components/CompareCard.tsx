import type {
  ComparisonDistrict,
} from "../types/comparison";

type Props = {
  district: ComparisonDistrict;
};

export default function CompareCard({
  district,
}: Props) {

  const clusterClass =
    district.cluster ===
    "CLuster Rendah"
      ? "cluster-rendah"
      : district.cluster ===
        "Cluster Sedang"
      ? "cluster-sedang"
      : "cluster-tinggi";

  return (
    <div className="compare-card">

      <h4>{district.name}</h4>

      <div className="compare-card-content">

        <div className="compare-item">

          <span>Cluster</span>

          <strong
            className={clusterClass}
          >
            {district.cluster}
          </strong>

        </div>

        <div className="compare-item">

          <span>
            Total Fasilitas
          </span>

          <strong>
            {district.totalFacilities}
          </strong>

        </div>

        <div className="compare-item">

          <span>
            Kategori Dominan
          </span>

          <strong>
            {district.dominantCategory}
          </strong>

        </div>

        <div className="compare-item">

          <span>
            Aktivitas Tertinggi
          </span>

          <strong>
            {district.topActivities}
          </strong>

        </div>

      </div>

    </div>
  );
}