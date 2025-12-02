// src/pages/ProfileAnalyticsDashboard.jsx
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  User,
  MapPin,
  MessageCircle,
  Copy,
  ExternalLink,
  LogOut,
  Zap,
  LayoutGrid,
  BarChart2,
  GitCommit,
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
  LabelList,
  ReferenceLine,
} from "recharts";
import useGetData from "../../api/useGetData";
import { RANGE_OPTIONS } from "../../constants/rangeOptions";
import { formatDate } from "../../utils/formatDate";
import useUserDetailStore from "./setup/store/useUserDetailStore";
import useAuthStore from "../../store/useAuthStore";
import usePostData from "../../api/usePostData";

// --- Custom Modern Colors ---
const ICON_BG = {
  blue: "text-sky-600 bg-sky-50/70",
  purple: "text-indigo-600 bg-indigo-50/70",
  green: "text-emerald-600 bg-emerald-50/70",
  yellow: "text-amber-600 bg-amber-50/70",
  red: "text-rose-600 bg-rose-50/70",
  orange: "text-orange-600 bg-orange-50/70",
};

// --- Utility Function for Truncation ---
const truncateUrl = (url, maxLength = 45) => {
  if (!url || url.length <= maxLength) {
    return url;
  }

  // Find the position of the domain or profile ID to keep it relevant
  const parts = url.split("/");

  // If the URL is very long, show the start, the domain, and the end ID
  if (url.length > 50) {
    const start = url.substring(0, 18); // e.g., https://synconnect.in/
    const middle = "...";
    const end = url.substring(url.length - 10); // last 10 characters of the ID
    return start + middle + end;
  }

  // Default simple truncation
  return url.substring(0, maxLength - 3) + "...";
};

const renderStars = (rating) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
        }`}
        aria-hidden
      />
    ))}
  </div>
);

/* -------------------------
   Utility Components (Spinner, EmptyState, SectionCard)
   -------------------------*/
const Spinner = ({ label = "Loading..." }) => (
  <div className="min-h-[240px] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-3 text-lg font-semibold text-sky-600">
      <svg
        className="animate-spin h-8 w-8 text-sky-500"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      <span>{label}</span>
    </div>
  </div>
);

const EmptyState = ({ icon: IconComp, title, subtitle }) => (
  <div className="p-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <IconComp className="w-6 h-6 text-gray-500" />
    </div>
    <h4 className="font-semibold text-gray-800 text-lg">{title}</h4>
    {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
  </div>
);

const SectionCard = ({ title, subtitle, children, className = "" }) => (
  <section
    className={`p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
  >
    {title && (
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    )}
    {children}
  </section>
);

const MetricCard = ({
  title,
  value,
  Icon,
  color = "blue",
  valueColor = "text-gray-900",
  trend,
  trendChange,
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendClass = trend === "up" ? "text-emerald-500" : "text-rose-500";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${ICON_BG[color]} flex-shrink-0`}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className={`text-xl sm:text-3xl font-bold ${valueColor} truncate`}>
            {value}
          </p>
          {trendChange && (
            <div
              className={`text-xs sm:text-sm font-semibold ${trendClass} flex items-center gap-1 flex-shrink-0`}
            >
              <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{trendChange}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   Charts
   -------------------------*/
const RatingDistributionChart = ({
  ratingDistribution = [],
  totalReviews = 0,
}) => {
  if (!ratingDistribution || ratingDistribution.length === 0) {
    return (
      <SectionCard title="Rating Distribution">
        <EmptyState
          icon={Star}
          title="No ratings yet"
          subtitle="Ratings will appear here once you receive reviews."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Rating Distribution"
      subtitle={`Total: ${totalReviews} reviews`}
      className="h-full"
    >
      <div className="h-60 sm:h-72 p-2 rounded-lg bg-gray-50/50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ratingDistribution}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#6b7280"
              width={100}
              tick={{ fill: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${value} reviews`, "Count"]}
            />
            <Bar dataKey="count" radius={[0, 10, 10, 0]} fill="#0ea5e9">
              {ratingDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#0ea5e9" />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                formatter={(val) => val.toString()}
                style={{ fill: "#374151", fontWeight: "bold" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
};

const TrendLineChart = ({ lineChartData = [], isIndividual = false }) => {
  if (!lineChartData || lineChartData.length === 0) {
    return (
      <SectionCard title="Interaction Trend (Views, Contact, Social)">
        <EmptyState
          icon={Eye}
          title="No trend data"
          subtitle="Collect more interactions to see trends over time."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Interaction Trend (Views, Contact, Social)">
      <div className="h-74 sm:h-80 animate-fadeIn rounded-lg shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis allowDecimals={false} stroke="#9ca3af" />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="contact"
              name="Contact"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="social"
              name="Social"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            {isIndividual && (
              <Line
                type="monotone"
                dataKey="leads"
                name="Leads"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            )}
            <ReferenceLine
              y={Math.round(
                lineChartData.reduce((s, d) => s + (d.views || 0), 0) /
                  Math.max(1, lineChartData.length)
              )}
              stroke="#4b5563"
              strokeDasharray="5 5"
              label={{
                value: "Avg views",
                position: "insideTopLeft",
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
};

// Social Platform Colors
const PLATFORM_COLORS = {
  Facebook: "#1877F2",
  Instagram: "#E1306C",
  X: "#000000",
  LinkedIn: "#0A66C2",
  TikTok: "#000000",
  YouTube: "#FF0000",
  Telegram: "#0088CC",
  Discord: "#5865F2",
  GitHub: "#24292E",
  GitLab: "#FC6D26",
  Figma: "#F24E1E",
  Dribbble: "#EA4C89",
  Behance: "#0057FF",
  Medium: "#000000",
  Substack: "#FF6719",
  Hashnode: "#2962FF",
  WordPress: "#21759B",
  Spotify: "#1DB954",
  Amazon: "#FF9900",
  Etsy: "#EB6D20",
  Shopify: "#95BF47",
  Paytm: "#00b9f5",
  PayPal: "#003087",
  Stripe: "#635BFF",
  Google: "#4285F4",
  GoogleMaps: "#34A853",
  Upwork: "#6fda44",
  Fiverr: "#1dbf73",
};

const randomBrandColor = (name) => {
  const hash = [...name].reduce(
    (acc, c) => c.charCodeAt(0) + ((acc << 5) - acc),
    0
  );
  return `hsl(${hash % 360}, 70%, 50%)`;
};

const SocialPieChart = ({ socialChartData = [] }) => {
  if (!socialChartData || socialChartData.length === 0) {
    return (
      <SectionCard title="Social Click Breakdown">
        <EmptyState
          icon={Globe}
          title="No social clicks yet"
          subtitle="Social clicks will appear once users interact."
        />
      </SectionCard>
    );
  }

  const total = socialChartData.reduce((sum, p) => sum + (p.value || 0), 0);

  const getColor = (platform) =>
    PLATFORM_COLORS[platform] || randomBrandColor(platform);

  return (
    <SectionCard title="Social Click Breakdown" subtitle="By platform">
      <div className="h-84 sm:h-80 flex items-center justify-center animate-fadeIn p-2 rounded-lg">
        {/* ResponsiveContainer ensures the chart scales to fit the container */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={socialChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              animationDuration={900}
              labelLine={false}
              label={({ percent }) =>
                percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {socialChartData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={getColor(entry.name)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => [
                `${value} clicks`,
                props.payload.name,
              ]}
              contentStyle={{
                borderRadius: "10px",
                borderColor: "#e5e7eb",
                fontSize: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 30 }}
              iconType="square"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-sm text-gray-600 text-center border-t pt-3">
        Total social clicks:
        <span className="font-bold text-gray-900 ml-1 text-base">{total}</span>
      </div>
    </SectionCard>
  );
};

const NegativeFeedbackList = ({ negativeFeedbackList = [] }) => (
  <SectionCard
    title="Private Feedback (1–2 Stars)"
    subtitle={`Total of ${negativeFeedbackList.length} reviews`}
    className="border-t-4 border-rose-500 h-full"
  >
    {negativeFeedbackList.length === 0 ? (
      <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700 mt-2 text-center text-base font-semibold italic">
        <ThumbsUp className="inline w-6 h-6 mr-2" />
        No negative feedback found in this period. Great job!
      </div>
    ) : (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {negativeFeedbackList.map((fb, i) => (
          <article
            key={i}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
              {renderStars(fb.rating)}
              <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-full border">
                {formatDate(fb.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 italic border-l-4 border-rose-400 pl-3 leading-relaxed mt-2">
              "{fb.feedback}"
            </p>
          </article>
        ))}
      </div>
    )}
  </SectionCard>
);

const LeadsGrid = ({ leads = [], totalLeads = 0 }) => {
  if (!leads || leads.length === 0) {
    return (
      <SectionCard title="Business Leads">
        <EmptyState
          icon={User}
          title="No leads found"
          subtitle="No connections made for this period."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Business Leads"
      subtitle={`${totalLeads} New Connections`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-2">
        {leads.map((lead) => {
          const initials = (lead.leadName || "NA")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <article
              key={lead._id}
              className="p-5 rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold border-2 border-orange-300 flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate">
                    {lead.leadName || "Unknown Contact"}
                  </h3>
                  <p className="text-sm text-gray-500">New Lead</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 truncate min-w-0">
                    Met at:{" "}
                    <span className="font-semibold text-gray-900">
                      {lead.placeWeMet || "Unspecified"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <a
                    href={`tel:${lead.contactNumber?.phoneNumber ?? ""}`}
                    className="text-indigo-600 font-semibold hover:underline truncate min-w-0"
                  >
                    {lead.contactNumber?.phoneNumber ?? "No Phone"}
                  </a>
                </div>

                {lead.note && (
                  <p className="text-sm text-gray-600 italic border-l-4 border-orange-400 pl-3 pt-1">
                    Note: "{lead.note}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                  {formatDate(lead.createdAt)}
                </span>
                <a
                  href={`https://wa.me/${(
                    lead.contactNumber?.dialCode ?? ""
                  ).replace("+", "")}${lead.contactNumber?.phoneNumber ?? ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 font-bold hover:text-emerald-500 transition flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
};

const MinimalUserHeader = ({ user }) => {
  if (!user) return null;

  const profileImg =
    user?.profilePhoto?.url ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user.fullName || "User") +
      "&background=a3a3a3&color=ffffff&size=128&bold=true";

  return (
    <div className="flex items-center gap-4 py-3 px-1">
      <img
        src={profileImg}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-gray-200 flex-shrink-0"
      />
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 truncate">
          Welcome back, {user.fullName?.split(" ")[0] || "User"}!
        </h3>
        <p className="text-sm text-gray-500">Dashboard Overview</p>
      </div>
    </div>
  );
};

/* -------------------------
   Header & Tabs
   -------------------------*/

const DashboardHeader = ({
  range,
  setRange,
  activeTab,
  setActiveTab,
  isBusiness,
  isIndividual,
}) => {
  const { user } = useAuthStore();

  const TABS = useMemo(() => {
    const tabs = [
      { key: "overview", label: "Overview", Icon: LayoutGrid },
      { key: "engagement", label: "Engagement", Icon: BarChart2 },
    ];
    if (isBusiness) {
      tabs.push({ key: "feedback", label: "Ratings & Feedback", Icon: Star });
    }
    if (isIndividual) {
      tabs.push({ key: "leads", label: "Connections & Leads", Icon: User });
    }
    return tabs;
  }, [isBusiness, isIndividual]);

  const logoutMutation = usePostData({
    onSuccess: () => {
      toast.success("Logged out successfully!");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate({
      url: "/auth/logout",
      method: "POST",
      data: {},
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar (Title & Tools) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex-shrink-0">
            Performance Analytics
          </h1>

          {/* Right Tools */}
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            {/* Range Selector */}
            <div className="relative flex-shrink-0">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-100 transition-shadow shadow-sm cursor-pointer"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-rose-50 transition border border-rose-200 shadow-sm flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation (Horizontal scroll on small screens if space runs out) */}
        <nav
          className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto whitespace-nowrap"
          aria-label="Tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  ${
                    isActive
                      ? "border-indigo-500 text-indigo-600 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                  group inline-flex items-center px-1 py-3 border-b-2 text-sm transition-colors duration-200 flex-shrink-0
                `}
              >
                <tab.Icon
                  className={`-ml-0.5 mr-2 w-5 h-5 ${
                    isActive
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

/* -------------------------
   Main Page
   -------------------------*/
export default function ProfileAnalyticsDashboard() {
  const userId = useAuthStore((state) => state.userId);
  const { user } = useUserDetailStore();
  const accountType = user?.accountType ?? "individual";
  const isBusiness = accountType === "business";
  const isIndividual = accountType === "individual";

  const [range, setRange] = useState("last_month");
  const [activeTab, setActiveTab] = useState("overview");

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
  const leads = data.leads?.list ?? [];
  const totalLeads = data.leads?.total ?? 0;

  const kpiData = useMemo(() => {
    const arr = [
      {
        title: "Total Profile Views",
        value: views.toLocaleString(),
        trend: "up",
        icon: Eye,
        color: "blue",
      },
      {
        title: "Social Media Clicks",
        value: (social.total ?? 0).toLocaleString(),
        trend: "up",
        icon: Globe,
        color: "purple",
      },
      {
        title: "Contact Actions",
        value: (contact.total ?? 0).toLocaleString(),
        trend: "up",
        icon: Phone,
        color: "green",
      },
    ];

    if (isBusiness) {
      arr.push({
        title: "Average Rating",
        value: ratings.average,
        trend: "up",
        icon: Star,
        color: "yellow",
        valueColor: "text-amber-600",
      });
    }

    if (isIndividual) {
      arr.push({
        title: "Total Connections",
        value: (totalLeads ?? 0).toLocaleString(),
        trend: "up",
        icon: User,
        color: "orange",
      });
    }

    // Filter out hidden placeholders for the final render
    return arr.filter((kpi) => !kpi.hidden);
  }, [
    views,
    social.total,
    contact.total,
    ratings.average,
    totalLeads,
    isBusiness,
    isIndividual,
  ]);

  const ratingDistribution = useMemo(() => {
    const stars = ratings.stars || {};
    return [5, 4, 3, 2, 1].map((s) => ({
      name: `${s} Star${s > 1 ? "s" : ""}`,
      count: stars[s] ?? 0,
    }));
  }, [ratings]);

  const getRandomColor = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  const socialChartData = useMemo(() => {
    return Object.keys(social)
      .filter((k) => k !== "total" && k !== "other" && social[k] > 0)
      .map((k) => ({
        name: k.charAt(0).toUpperCase() + k.slice(1),
        value: social[k],
        color: getRandomColor(k),
      }));
  }, [social]);

  const trend = data.trend ?? {};
  const lineChartData = useMemo(() => {
    if (!trend.labels) return [];
    return trend.labels.map((lbl, i) => ({
      label: lbl,
      views: trend.views?.[i] ?? 0,
      contact: trend.contact?.[i] ?? 0,
      social: trend.social?.[i] ?? 0,
      leads: trend.leads?.[i] ?? 0,
    }));
  }, [trend]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="text-lg text-gray-600 p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
          Please sign in to view analytics.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <DashboardHeader
          range={range}
          setRange={setRange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isBusiness={isBusiness}
          isIndividual={isIndividual}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <MinimalUserHeader user={user} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Spinner
            label={`Loading Analytics for ${
              RANGE_OPTIONS.find((o) => o.key === range)?.label || "this period"
            }...`}
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-rose-600 p-10 bg-white rounded-2xl shadow-xl border border-rose-300">
          <AlertTriangle className="w-8 h-8 inline mr-2 align-text-bottom" />{" "}
          Error loading data. Please try refreshing.
        </div>
      </div>
    );
  }

  // --- Tab Content Rendering Logic ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <ProfileLink user={user} />

            {/* KPI CARDS (Responsive: 2 on mobile, 3 on tablet, 4 on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 sm:gap-6">
              {kpiData.map((kpi, idx) => (
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
              ))}
            </div>

            {/* Quick Chart View (Trend & Social Breakdown) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendLineChart
                  isIndividual={isIndividual}
                  lineChartData={lineChartData}
                />
              </div>
              <SocialPieChart socialChartData={socialChartData} />
            </div>

            {/* Settings CTA */}
            <section
              className="p-5 bg-white rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-[1.005]"
              onClick={() => (window.location.href = "/setup")}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-500" /> Complete Setup /
                    Branding
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add or update your business details, branding, and
                    preferences to maximize performance.
                  </p>
                </div>
                <div className="min-w-[48px] min-h-[48px] bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl flex-shrink-0">
                  <ChevronDown
                    className="w-6 h-6 rotate-270"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </section>
          </div>
        );

      case "engagement":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TrendLineChart
                isIndividual={isIndividual}
                lineChartData={lineChartData}
              />
            </div>
            <div className="space-y-6">
              <SocialPieChart socialChartData={socialChartData} />
              <SectionCard title="Contact Breakdown" subtitle="By Type">
                <div className="space-y-2">
                  {Object.entries(contact)
                    .filter(([key]) => key !== "total")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace("whatsapp", "WhatsApp")}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </SectionCard>
            </div>
          </div>
        );

      case "feedback":
        if (isBusiness) {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingDistributionChart
                ratingDistribution={ratingDistribution}
                totalReviews={ratings.totalReviews}
              />
              <NegativeFeedbackList
                negativeFeedbackList={negativeFeedbackList}
              />
            </div>
          );
        }
        return (
          <EmptyState
            icon={AlertTriangle}
            title="Not Applicable"
            subtitle="This section is only available for Business accounts."
          />
        );

      case "leads":
        if (isIndividual) {
          return (
            <div className="grid grid-cols-1">
              <LeadsGrid leads={leads} totalLeads={totalLeads} />
            </div>
          );
        }
        return (
          <EmptyState
            icon={AlertTriangle}
            title="Not Applicable"
            subtitle="This section is only available for Individual accounts."
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <title>Profile Analytics Dashboard</title>
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <MinimalUserHeader user={user} />
        </div>

        <DashboardHeader
          range={range}
          setRange={setRange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isBusiness={isBusiness}
          isIndividual={isIndividual}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}

          <footer className="mt-10 pt-6 border-t border-gray-200 text-gray-500 text-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <span>Last Updated: {new Date().toLocaleString()}</span>
              <span className="font-semibold">
                Powered by Synconnect Analytics
              </span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

// ProfileLink component (Uses truncateUrl utility)
const ProfileLink = ({ user }) => {
  const domain = import.meta.env.VITE_APP_DOMAIN_NAME || "synconnect.in";
  const profileUrl = useMemo(() => {
    if (!user?._id) return "#";
    const base = domain.startsWith("http") ? domain : `https://${domain}`;
    return user.accountType === "individual"
      ? `${base}/profile/${user._id}`
      : `${base}/business/${user._id}`;
  }, [user, domain]);

  if (!user?._id) return null;

  const copiedUrlDisplay = useMemo(
    () => truncateUrl(profileUrl, 45),
    [profileUrl]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (err) {
      toast.error("Could not copy link");
    }
  };

  return (
    <SectionCard
      className="mb-4 bg-sky-50/50 border-sky-200"
      title="Access Your Live Profile"
      subtitle="Quick access to view and share your live profile URL."
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Display the truncated URL */}
          <p className="text-sm text-gray-700 font-mono p-2 bg-white rounded-lg border border-gray-300 truncate max-w-full">
            {copiedUrlDisplay}
          </p>
          {/* Tighter margin-top: mt-3 */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.open(profileUrl, "_blank")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 border border-sky-700 text-white hover:bg-sky-700 transition shadow-md text-sm font-semibold flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" /> Open Profile
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm rounded-xl hover:bg-gray-100 transition border border-gray-300 shadow-sm font-medium flex-shrink-0"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>

        <div className="hidden md:flex min-w-[64px] min-h-[64px] bg-sky-100 text-sky-600 items-center justify-center rounded-xl shadow-lg flex-shrink-0">
          <Globe className="w-8 h-8" strokeWidth={1.5} />
        </div>
      </div>
    </SectionCard>
  );
};
