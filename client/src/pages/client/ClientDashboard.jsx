// src/pages/ProfileAnalyticsDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Star,
  Eye,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  AlertTriangle,
  Globe,
  Phone,
  ChevronDown,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import useGetData from "../../api/useGetData";
import { RANGE_OPTIONS } from "../../constants/rangeOptions";
import { RATING_COLORS } from "../../constants/ratingColors";
import { formatDate } from "../../utils/formatDate";

const renderStars = (rating) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const iconColorMap = {
  blue: "text-blue-600 bg-blue-50",
  purple: "text-purple-600 bg-purple-50",
  green: "text-green-600 bg-green-50",
  yellow: "text-yellow-600 bg-yellow-50",
  red: "text-red-600 bg-red-50",
  orange: "text-orange-600 bg-orange-50",
};

const MetricCard = ({
  title,
  value,
  Icon,
  color,
  valueColor = "text-gray-900",
  trend,
  trendChange,
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  const iconTint = iconColorMap[color];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconTint}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <p className="text-sm text-gray-500 mt-3">{title}</p>
      <p className={`text-3xl font-semibold mt-1 ${valueColor}`}>{value}</p>

      {/* {trendChange && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendChange}
          </span>
        </div>
      )} */}
    </div>
  );
};

const DashboardHeader = ({ range, setRange }) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Performance Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Full profile performance overview
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow w-full"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Rating Distribution Bar Chart Component
 */
const RatingDistributionChart = ({ ratingDistribution, totalReviews }) => (
  <section className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <Star className="text-yellow-500" /> Rating Distribution (Total:{" "}
      {totalReviews})
    </h3>
    <div className="h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ratingDistribution}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "11px" }} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#9ca3af"
            style={{ fontSize: "11px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value} reviews`, "Count"]}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {ratingDistribution.map((_, idx) => (
              <Cell key={idx} fill={RATING_COLORS[idx]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);

/**
 * Multi-Line Trend Chart Component (Views, Contact, Social)
 */
const TrendLineChart = ({ lineChartData }) => (
  <section className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <Eye className="text-blue-600" /> Trend — Views · Contact · Social
    </h3>
    <div className="h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={lineChartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            style={{ fontSize: "11px" }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#9ca3af"
            style={{ fontSize: "11px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="contact"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="social"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
);

/**
 * Social Platform Clicks Pie Chart Component
 */
const SocialPieChart = ({ socialChartData }) => (
  <section className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <Globe className="text-indigo-600" /> Social Platform Clicks
    </h3>
    <div className="h-64 sm:h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={socialChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            labelLine={false}
            label={({ name, percent }) =>
              socialChartData.length <= 5
                ? `${name} (${(percent * 100).toFixed(0)}%)`
                : ""
            }
          >
            {socialChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "12px",
            }}
            formatter={(value, name, props) => [
              `${value} clicks`,
              props.payload.name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </section>
);

/**
 * Negative Feedback List Component
 */
const NegativeFeedbackList = ({ negativeFeedbackList }) => (
  <section className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Private Feedback (1–2 Stars)
        </h2>
      </div>

      <span className="self-start sm:self-auto bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
        {negativeFeedbackList.length} Total
      </span>
    </div>

    {/* No Data */}
    {negativeFeedbackList.length === 0 ? (
      <div className="p-4 bg-gray-50 rounded border text-gray-600 mt-4 text-center text-sm italic">
        <ThumbsUp className="inline w-5 h-5 mr-1" />
        No negative feedback found in this period. Great job!
      </div>
    ) : (
      <div className="space-y-4">
        {negativeFeedbackList.map((fb, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-red-200 bg-white hover:bg-red-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
              {/* Star + Date */}
              <div className="flex flex-wrap items-center gap-3">
                {renderStars(fb.rating)}
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {formatDate(fb.createdAt)}
                </span>
              </div>
            </div>

            {/* Feedback text */}
            <p className="text-sm text-gray-700 italic border-l-4 border-red-400 pl-3 leading-relaxed">
              "{fb.feedback}"
            </p>
          </div>
        ))}
      </div>
    )}
  </section>
);

// --- MAIN DASHBOARD COMPONENT ---

export default function ProfileAnalyticsDashboard() {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [range, setRange] = useState("last_month");

  const {
    data: resp,
    isLoading,
    isError,
  } = useGetData({
    queryKey: ["analytics", userId, range],
    url: `/business/analytics?userId=${userId}&range=${range}`,
    enabled: !!userId,
  });

  const data = resp?.data ?? {};
  const views = Number(data.views ?? 0);
  const contact = data.contact ?? {
    total: 0,
    call: 0,
    email: 0,
    whatsapp: 0,
    sms: 0,
    telegram: 0,
    other: 0,
  };
  const social = data.social ?? { total: 0, other: 0 };

  const ratings = useMemo(
    () => ({
      average: Number(data.ratings?.average ?? 0).toFixed(1),
      totalReviews: Number(data.ratings?.totalReviews ?? 0),
      negativeReviews: Number(data.ratings?.negativeReviews ?? 0),
      stars: data.ratings?.stars ?? {},
    }),
    [data.ratings]
  );
  const negativeFeedbackList = data.negativeFeedbackList ?? [];

  const kpiData = useMemo(
    () => [
      {
        title: "Total Profile Views",
        value: views.toLocaleString(),
        change: "+12.5%",
        trend: "up",
        icon: Eye,
        color: "blue",
      },
      {
        title: "Social Media Interactions",
        value: (social.total ?? 0).toLocaleString(),
        change: "+8.2%",
        trend: "up",
        icon: Globe,
        color: "purple",
      },
      {
        title: "Contact Actions",
        value: (contact.total ?? 0).toLocaleString(),
        change: "+15.3%",
        trend: "up",
        icon: Phone,
        color: "green",
      },
      {
        title: "Average Rating",
        value: ratings.average,
        change: "+0.3",
        trend: "up",
        icon: Star,
        color: "yellow",
        valueColor: "text-yellow-600",
      },
      {
        title: "Private Negative Reviews",
        value: ratings.negativeReviews.toLocaleString(),
        change: "-18.2%",
        trend: "down",
        icon: AlertTriangle,
        color: "red",
      },
    ],
    [
      views,
      social.total,
      contact.total,
      ratings.average,
      ratings.negativeReviews,
    ]
  );

  const ratingDistribution = useMemo(() => {
    const stars = ratings.stars || {};
    return [5, 4, 3, 2, 1].map((s) => ({
      name: `${s} Star${s > 1 ? "s" : ""}`,
      count: stars[s] ?? 0,
    }));
  }, [ratings]);

  const getRandomColor = (key) => {
    // Generate a seeded random color based on the key (stable for each platform)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }

    return color;
  };

  const socialChartData = useMemo(
    () =>
      Object.keys(social)
        .filter((k) => k !== "total" && k !== "other" && social[k] > 0)
        .map((k) => ({
          name: k.charAt(0).toUpperCase() + k.slice(1),
          value: social[k],
          color: getRandomColor(k), // ← random stable color
        })),
    [social]
  );

  const trend = data.trend ?? {};

  const lineChartData = useMemo(() => {
    if (!trend.labels) return [];

    return trend.labels.map((lbl, i) => ({
      label: lbl,
      views: trend.views?.[i] ?? 0,
      contact: trend.contact?.[i] ?? 0,
      social: trend.social?.[i] ?? 0,
    }));
  }, [trend]);

  // --- LOADING / ERROR STATES ---

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 p-8 bg-white rounded-xl shadow-lg">
          Please sign in to view analytics.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-lg font-semibold text-blue-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading Analytics for {range.replace("_", " ")}...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600 p-8 bg-white rounded-xl shadow-lg border border-red-300">
          <AlertTriangle className="w-6 h-6 inline mr-2" /> Error loading data.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader range={range} setRange={setRange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* SETUP PROFILE CTA */}
        <section
          className="p-5 bg-white rounded-xl shadow-md border border-gray-200 mb-8 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => (window.location.href = "/setup")}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Edit / Complete Setup
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add or update your business details, branding, and preferences.
              </p>
            </div>

            <div className="min-w-[48px] min-h-[48px] bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
              <ChevronDown className="w-5 h-5 rotate-270" />
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {kpiData.map((kpi, idx) => {
            console.log(kpi);

            return (
              <MetricCard
                key={idx}
                title={kpi.title}
                value={kpi.value}
                Icon={kpi.icon}
                color={kpi.color}
                valueColor={kpi.valueColor}
                trend={kpi.trend}
                trendChange={kpi.change}
              />
            );
          })}
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RatingDistributionChart
            ratingDistribution={ratingDistribution}
            totalReviews={ratings.totalReviews}
          />

          <TrendLineChart lineChartData={lineChartData} />

          <SocialPieChart socialChartData={socialChartData} />

          {/* Filler or additional chart can go here */}
          {/* <section className="p-5 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium">
                Additional Chart Placeholder
              </p>
              <p className="text-sm">e.g., Service Bookings or Shares</p>
            </div>
          </section> */}
        </div>

        {/* NEGATIVE FEEDBACK */}
        <NegativeFeedbackList negativeFeedbackList={negativeFeedbackList} />

        {/* FOOTER */}
        <footer className="mt-10 pt-6 border-t text-gray-500 text-sm">
          <div className="flex justify-between">
            <span>Updated {new Date().toLocaleString()}</span>
            <span>Powered by Synconnect Analytics</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
