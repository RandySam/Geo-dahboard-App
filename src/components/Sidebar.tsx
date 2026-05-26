import {
  BarChart3,
  ChevronDown,
  Layers3,
  LayoutGrid,
} from "lucide-react";

import {
  useState,
} from "react";

import AnalyticsPanel from "./AnalyticsPanel";

import LayerPanel from "./LayerPanel";

import OverviewPanel from "./OverviewPanel";

type Props = {
  totalKecamatan: number;

  categoriesStat: {
    id: string;

    name: string;

    total: number;
  }[];

  showBatas: boolean;

  setShowBatas: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  showFasilitas: boolean;

  setShowFasilitas: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  showCluster: boolean;

  setShowCluster: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  selectedCategories: string[];

  setSelectedCategories: React.Dispatch<
    React.SetStateAction<
      string[]
    >
  >;

  districtDetails: any[];

  compareRegions: any[];

  comparisonResult: any;

  barChartData: any[];

  pieChartData: any[];

  setSelectedCoords: React.Dispatch<
    React.SetStateAction<
      [number, number] | null
    >
  >;

  onCompareRegion: (
    regionA: string,
    regionB: string
  ) => void;
};

type PanelType =
  | "overview"
  | "layers"
  | "analytics";

export default function Sidebar({
  totalKecamatan,

  categoriesStat,

  showBatas,
  setShowBatas,

  showFasilitas,
  setShowFasilitas,

  showCluster,
  setShowCluster,

  selectedCategories,
  setSelectedCategories,

  districtDetails,

  compareRegions,

  comparisonResult,

  barChartData,

  pieChartData,

  setSelectedCoords,

  onCompareRegion,
}: Props) {
  const [
    activePanel,
    setActivePanel,
  ] = useState<PanelType>(
    "overview"
  );

  const [
    showDropdown,
    setShowDropdown,
  ] = useState(false);

  /* =========================
     PANEL CONFIG
  ========================= */

  const panelConfig = {
    overview: {
      label: "Overview",

      icon: LayoutGrid,
    },

    layers: {
      label: "Layers",

      icon: Layers3,
    },

    analytics: {
      label: "Analytics",

      icon: BarChart3,
    },
  };

  const ActiveIcon =
    panelConfig[
      activePanel
    ].icon;

  return (
    <aside className="sidebar-modern">

      {/* =========================
          PANEL SELECTOR
      ========================= */}

      <div className="sidebar-selector">

        <button
          className="sidebar-selector-btn"
          onClick={() =>
            setShowDropdown(
              !showDropdown
            )
          }
        >

          <div className="sidebar-selector-left">

            <ActiveIcon
              size={28}
            />

            <span>
              {
                panelConfig[
                  activePanel
                ].label
              }
            </span>

          </div>

          <ChevronDown
            size={24}
          />

        </button>

        {showDropdown && (

          <div className="sidebar-dropdown-menu">

            {(
              Object.keys(
                panelConfig
              ) as PanelType[]
            ).map(
              (panel) => {

                const Icon =
                  panelConfig[
                    panel
                  ].icon;

                return (
                  <button
                    key={panel}
                    className="sidebar-dropdown-item"
                    onClick={() => {

                      setActivePanel(
                        panel
                      );

                      setShowDropdown(
                        false
                      );
                    }}
                  >

                    <div className="sidebar-selector-left">

                      <Icon
                        size={
                          24
                        }
                      />

                      <span>
                        {
                          panelConfig[
                            panel
                          ]
                            .label
                        }
                      </span>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* =========================
          ACTIVE PANEL
      ========================= */}

      <div className="sidebar-panel-content">

        {/* =========================
            OVERVIEW
        ========================= */}

        {activePanel ===
          "overview" && (

          <OverviewPanel
            totalKecamatan={
              totalKecamatan
            }
            categoriesStat={
              categoriesStat
            }
          />

        )}

        {/* =========================
            LAYERS
        ========================= */}

        {activePanel ===
          "layers" && (

          <LayerPanel
            showBatas={
              showBatas
            }
            setShowBatas={
              setShowBatas
            }
            showFasilitas={
              showFasilitas
            }
            setShowFasilitas={
              setShowFasilitas
            }
            showCluster={
              showCluster
            }
            setShowCluster={
              setShowCluster
            }
            selectedCategories={
              selectedCategories
            }
            setSelectedCategories={
              setSelectedCategories
            }
            categoriesStat={
              categoriesStat
            }
          />

        )}

        {/* =========================
            ANALYTICS
        ========================= */}

        {activePanel ===
          "analytics" && (

          <AnalyticsPanel
            districtDetails={
              districtDetails
            }
            compareRegions={
              compareRegions
            }
            comparisonResult={
              comparisonResult
            }
            barChartData={
              barChartData
            }
            pieChartData={
              pieChartData
            }
            setSelectedCoords={
              setSelectedCoords
            }
            onCompareRegion={
              onCompareRegion
            }
          />

        )}

      </div>

    </aside>
  );
}