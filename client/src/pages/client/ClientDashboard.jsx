import React from "react";
import {
  Users,
  Star,
  Eye,
  MessageCircle, // Used for Contact Clicks
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3, // Using BarChart3 for the main component icon
  CheckCircle,
  Globe, // Used for Social Media Chart
} from "lucide-react";
// Import Recharts components (assuming a React environment where these imports are handled)
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- DUMMY DATA FOR ANALYTICS ---
const DUMMY_ANALYTICS = {
  profileViews: 12450,
  uniqueVisitors: 8900,
  callClicks: 452, // Used in the new metric
  emailClicks: 189, // Used in the new metric
  socialClicks: 612,
  avgRating: 4.8,
  totalReviews: 145,
  lowRatingFeedback: 12, // UserRating < 3 (Private Feedback)
  highRatingReviews: 133, // UserRating >= 3 (Public Reviews)
  monthlyGrowthRate: 12.5, // %
  lastUpdated: "2025-11-10 10:30 AM",
};

const DUMMY_NEGATIVE_FEEDBACK = [
  {
    id: 1,
    rating: 2,
    issue:
      "Slow response time on initial sales inquiry. Took 4 days for a callback.",
    date: "2025-11-08",
  },
  {
    id: 2,
    rating: 1,
    issue:
      "The demo product was buggy and crashed several times during our presentation.",
    date: "2025-11-05",
  },
  {
    id: 3,
    rating: 2,
    issue:
      "Pricing structure was not transparent. Hidden fees were revealed late in the process.",
    date: "2025-10-29",
  },
  {
    id: 4,
    rating: 1,
    issue:
      "The support agent was rude and dismissive when I reported a critical bug.",
    date: "2025-10-20",
  },
];

// Data for charts
const DUMMY_MONTHLY_VIEWS = [
  { name: "Jul", Views: 8200, Visitors: 6100 },
  { name: "Aug", Views: 9500, Visitors: 7300 },
  { name: "Sep", Views: 10800, Visitors: 7900 },
  { name: "Oct", Views: 11500, Visitors: 8500 },
  { name: "Nov", Views: 12450, Visitors: 8900 },
];

const DUMMY_RATING_DISTRIBUTION = [
  { name: "5 Stars", count: 98, color: "#34d399" }, // green-400
  { name: "4 Stars", count: 35, color: "#facc15" }, // yellow-400
  { name: "3 Stars", count: 12, color: "#f97316" }, // orange-500 (Neutral)
  { name: "2 Stars", count: 7, color: "#f87171" }, // red-400
  { name: "1 Star", count: 5, color: "#ef4444" }, // red-500
];

const DUMMY_SOCIAL_ENGAGEMENT = [
  { name: "Jul", LinkedIn: 200, Facebook: 150, X: 50 },
  { name: "Aug", LinkedIn: 240, Facebook: 180, X: 60 },
  { name: "Sep", LinkedIn: 280, Facebook: 200, X: 75 },
  { name: "Oct", LinkedIn: 320, Facebook: 220, X: 90 },
  { name: "Nov", LinkedIn: 350, Facebook: 240, X: 110 },
];

// --- Helper component for an individual Metric Card ---
const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
  description,
}) => (
  <div
    // Enhanced styling for classical light: defined border, shadow-lg, and lift on hover
    className={`p-4 sm:p-5 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]`}
  >
    <div className="flex items-center justify-between">
      <div className={`p-2 sm:p-3 rounded-lg ${color} text-white shadow-md`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="text-right">
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 leading-none">
          {value}
        </p>
        <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
          {title}
        </p>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
      <p className="text-[10px] sm:text-xs text-gray-500 italic">
        {description}
      </p>
      {trend !== undefined && (
        <div
          className={`text-[10px] sm:text-xs font-semibold flex items-center ${
            trend > 0
              ? "text-green-600 bg-green-100"
              : trend < 0
              ? "text-red-600 bg-red-100"
              : "text-gray-500 bg-gray-100"
          } px-2 py-1 rounded-full`}
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

// --- New Component: Analytics Charts ---
const AnalyticsCharts = ({ theme }) => {
  // Define chart border/text colors based on the clean light theme
  const chartStroke = "#d1d5db"; // Light gray for grid
  const chartText = "#6b7280"; // Gray 500/600 for text
  const tooltipBg = "white";
  const tooltipBorder = "#e5e7eb";

  return (
    // Charts display in a single column on mobile, switching to 3 on large screens
    <section className="mt-8 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* 1. Profile Views Trend Chart */}
      <div
        className={`p-5 rounded-xl shadow-lg border ${theme.border} bg-white`}
      >
        <h3
          className={`text-xl font-bold ${theme.text} mb-4 flex items-center gap-2`}
        >
          <Eye className="w-5 h-5 text-blue-600" /> Traffic Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={DUMMY_MONTHLY_VIEWS}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
            <XAxis dataKey="name" stroke={chartText} />
            <YAxis stroke={chartText} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              itemStyle={{ color: "#1f2937" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Views"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Page Views"
            />
            <Line
              type="monotone"
              dataKey="Visitors"
              stroke="#8b5cf6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Unique Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Rating Distribution Chart (Focus on Reviews) */}
      <div
        className={`p-5 rounded-xl shadow-lg border ${theme.border} bg-white`}
      >
        <h3
          className={`text-xl font-bold ${theme.text} mb-4 flex items-center gap-2`}
        >
          <Star className="w-5 h-5 text-yellow-500" /> Star Rating Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={DUMMY_RATING_DISTRIBUTION}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
            <XAxis dataKey="name" stroke={chartText} />
            <YAxis stroke={chartText} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              itemStyle={{ color: "#1f2937" }}
              formatter={(value) => [value, "Reviews"]}
            />
            <Bar dataKey="count">
              {DUMMY_RATING_DISTRIBUTION.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  fill={entry.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Social Media Engagement Trend (Focus on Social) */}
      <div
        className={`p-5 rounded-xl shadow-lg border ${theme.border} bg-white`}
      >
        <h3
          className={`text-xl font-bold ${theme.text} mb-4 flex items-center gap-2`}
        >
          <Globe className="w-5 h-5 text-indigo-600" /> Social Clicks Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={DUMMY_SOCIAL_ENGAGEMENT}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
            <XAxis dataKey="name" stroke={chartText} />
            <YAxis stroke={chartText} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              itemStyle={{ color: "#1f2937" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="LinkedIn"
              stroke="#0a66c2"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Facebook"
              stroke="#1877f2"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="X"
              stroke="#000000"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

// --- New Component: Negative Feedback List ---
const NegativeFeedbackSection = ({ theme }) => (
  <section className="mt-8">
    <h2
      className={`text-2xl font-extrabold ${theme.text} mb-6 flex items-center gap-2 border-b pb-2 border-gray-200`}
    >
      <MessageSquare className="w-6 h-6 text-red-600" />
      Actionable Private Feedback (1-2 Stars)
    </h2>
    <div className="space-y-4">
      {DUMMY_NEGATIVE_FEEDBACK.map((feedback) => (
        <div
          key={feedback.id}
          className={`p-5 rounded-xl border border-red-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < feedback.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 fill-gray-300/50" // Adjusted empty star fill
                  }`}
                />
              ))}
              <span className={`ml-3 text-base font-bold ${theme.text}`}>
                {feedback.rating} Star Rating
              </span>
            </div>
            <span className={`text-xs text-gray-500 italic`}>
              Reported: {new Date(feedback.date).toLocaleDateString()}
            </span>
          </div>
          <p
            className={`text-sm text-gray-600 leading-relaxed border-l-4 border-red-400 pl-3 py-1`}
          >
            "{feedback.issue}"
          </p>
          <button className="mt-3 inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-800 transition">
            <CheckCircle className="w-3 h-3 mr-1" /> Mark as Resolved
          </button>
        </div>
      ))}
      <div
        className={`p-4 text-center rounded-xl bg-red-50 text-red-700 text-sm border border-dashed border-red-300`}
      >
        Viewing {DUMMY_NEGATIVE_FEEDBACK.length} of{" "}
        {DUMMY_ANALYTICS.lowRatingFeedback} total private feedback entries.
        Action Required.
      </div>
    </div>
  </section>
);

// --- Main Component ---

export default function ProfileAnalyticsDashboard({ theme }) {
  const {
    profileViews,
    uniqueVisitors,
    avgRating,
    totalReviews,
    lowRatingFeedback,
    highRatingReviews,
    monthlyGrowthRate,
    lastUpdated,
  } = DUMMY_ANALYTICS;

  // Use defined Classical Light Default Theme
  const dashboardTheme = {
    bg: "bg-gray-50", // Soft background
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
  };

  // UPDATED METRICS ARRAY: Unique Visitors replaced with Contact Clicks
  const metrics = [
    {
      title: "Profile Views",
      value: profileViews.toLocaleString(),
      icon: Eye,
      color: "bg-blue-600",
      trend: monthlyGrowthRate,
      description: "Total profile views this month",
    },
    {
      title: "Contact Clicks", // NEW METRIC
      value: (
        DUMMY_ANALYTICS.callClicks + DUMMY_ANALYTICS.emailClicks
      ).toLocaleString(),
      icon: MessageCircle, // NEW ICON
      color: "bg-purple-600", // Using the previous slot's color
      trend: monthlyGrowthRate + 5, // Mocked new trend
      description: `Calls (${DUMMY_ANALYTICS.callClicks}) + Emails (${DUMMY_ANALYTICS.emailClicks})`,
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "bg-yellow-600",
      trend: 0.1,
      description: `${totalReviews} total reviews`,
    },
    {
      title: "Positive Reviews",
      value: highRatingReviews,
      icon: ThumbsUp,
      color: "bg-teal-600",
      trend: monthlyGrowthRate,
      description: "Public reviews (3+ stars)",
    },
    {
      title: "Private Feedback",
      value: lowRatingFeedback,
      icon: ThumbsDown,
      color: "bg-red-600",
      trend: -5.0,
      description: "Private feedback (1-2 stars)",
    },
    {
      title: "Social Clicks",
      value: DUMMY_ANALYTICS.socialClicks.toLocaleString(),
      icon: Globe,
      color: "bg-indigo-600",
      trend: 9.8,
      description: "Total clicks on social media links",
    },
  ];

  return (
    <div
      className={`min-h-screen ${dashboardTheme.bg} p-4 sm:p-8 lg:p-12 transition-all duration-500 font-inter`}
    >
      <style>{`
        /* Clean Light Scrollbar Style */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f0f0; 
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-10 flex justify-between items-center border-b pb-4 border-gray-200">
          <div>
            <h1
              className={`text-3xl sm:text-4xl font-extrabold ${dashboardTheme.text} mb-1 flex items-center gap-3`}
            >
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Synconnect Dashboard
            </h1>
            <p
              className={`${dashboardTheme.textSecondary} text-base sm:text-lg`}
            >
              Focused on Review Performance and Audience Engagement.
            </p>
          </div>
        </header>

        {/* --- Metric Cards (Responsive Grid: 2 columns on mobile, 3 on tablet/desktop) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* --- Data Visualizations (Charts) --- */}
        <AnalyticsCharts theme={dashboardTheme} />

        {/* --- Actionable Feedback List --- */}
        <NegativeFeedbackSection theme={dashboardTheme} />

        {/* --- Footer --- */}
        <footer
          className={`mt-10 pt-6 border-t ${dashboardTheme.border} text-gray-500`}
        >
          <p className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Data last refreshed: {new Date(lastUpdated).toLocaleString()}
          </p>
        </footer>
      </div>
    </div>
  );
}
