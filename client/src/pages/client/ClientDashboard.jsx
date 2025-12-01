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
import { RATING_COLORS } from "../../constants/ratingColors";
import { formatDate } from "../../utils/formatDate";
import useUserDetailStore from "./setup/store/useUserDetailStore";
import useAuthStore from "../../store/useAuthStore";
import usePostData from "../../api/usePostData";

const ICON_BG = {
  blue: "text-blue-600 bg-blue-50",
  purple: "text-purple-600 bg-purple-50",
  green: "text-green-600 bg-green-50",
  yellow: "text-yellow-600 bg-yellow-50",
  red: "text-red-600 bg-red-50",
  orange: "text-orange-600 bg-orange-50",
};

const renderStars = (rating) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
        }`}
        aria-hidden
      />
    ))}
  </div>
);

/* -------------------------
   Small UI Components
   -------------------------*/
const Spinner = ({ label = "Loading..." }) => (
  <div className="min-h-[240px] flex items-center justify-center">
    <div className="flex items-center space-x-3 text-lg font-semibold text-blue-600">
      <svg
        className="animate-spin h-6 w-6 text-blue-500"
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
  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <IconComp className="w-6 h-6 text-gray-500" />
    </div>
    <h4 className="font-semibold text-gray-800">{title}</h4>
    {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
  </div>
);

const SectionCard = ({ title, subtitle, children, className = "" }) => (
  <section
    className={`p-5 bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
  >
    {title && (
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {title}
            {subtitle && (
              <span className="text-sm text-gray-500 ml-2">{subtitle}</span>
            )}
          </h3>
        </div>
      </div>
    )}
    {children}
  </section>
);

/* -------------------------
   Metric / KPI Card
   -------------------------*/
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
  const trendClass = trend === "up" ? "text-emerald-600" : "text-red-600";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${ICON_BG[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-3">
          <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
          {trendChange && (
            <div
              className={`text-sm font-medium ${trendClass} flex items-center gap-1`}
            >
              <TrendIcon className="w-4 h-4" />
              <span>{trendChange}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   Header
   -------------------------*/

const DashboardHeader = ({ range, setRange }) => {
  const logoutMutation = usePostData({
    onSuccess: () => {
      // Clear tokens/local storage etc.
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // redirect
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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Left */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Performance Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Full profile performance overview
            </p>
          </div>

          {/* Right Tools */}
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            {/* Range Selector */}
            <div className="relative">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
              className="p-2 rounded-lg hover:bg-red-50 transition border border-red-200"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
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
        {" "}
        <EmptyState
          icon={Star}
          title="No ratings yet"
          subtitle="Ratings will appear here once you receive reviews."
        />{" "}
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Rating Distribution"
      subtitle={`Total: ${totalReviews}`}
    >
      <div className="h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ratingDistribution}
            layout="vertical"
            margin={{ top: 5, right: 12, left: 12, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopOpacity={0.95} stopColor="#60a5fa" />
                <stop offset="100%" stopOpacity={0.95} stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={90} />
            <Tooltip formatter={(value) => [`${value} reviews`, "Count"]} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="url(#barGrad)">
              <LabelList
                dataKey="count"
                position="right"
                formatter={(val) => val.toString()}
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
      <SectionCard title="Trend — Views · Contact · Social">
        {" "}
        <EmptyState
          icon={Eye}
          title="No trend data"
          subtitle="Collect more interactions to see trends over time."
        />{" "}
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Trend — Views · Contact · Social">
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 6 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis allowDecimals={false} stroke="#9ca3af" />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
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
            {isIndividual && (
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}
            {/* optional reference to show average */}
            <ReferenceLine
              y={Math.round(
                lineChartData.reduce((s, d) => s + (d.views || 0), 0) /
                  Math.max(1, lineChartData.length)
              )}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
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

const SocialPieChart = ({ socialChartData = [] }) => {
  if (!socialChartData || socialChartData.length === 0) {
    return (
      <SectionCard title="Social Platform Clicks">
        {" "}
        <EmptyState
          icon={Globe}
          title="No social clicks"
          subtitle="Social platform clicks will show up here."
        />{" "}
      </SectionCard>
    );
  }

  // compute total to show center label
  const total = socialChartData.reduce((s, p) => s + (p.value || 0), 0);

  return (
    <SectionCard title="Social Platform Clicks">
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
              labelLine={false}
              label={({ percent }) =>
                percent > 0.07 ? `${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {socialChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} clicks`,
                props.payload.name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-sm text-gray-600 text-center">
        Total clicks:{" "}
        <span className="font-medium text-gray-800 ml-1">{total}</span>
      </div>
    </SectionCard>
  );
};

/* -------------------------
   Negative Feedback list
   -------------------------*/
const NegativeFeedbackList = ({ negativeFeedbackList = [] }) => (
  <SectionCard
    title="Private Feedback (1–2 Stars)"
    subtitle={`${negativeFeedbackList.length} Total`}
  >
    {negativeFeedbackList.length === 0 ? (
      <div className="p-4 bg-gray-50 rounded border text-gray-600 mt-2 text-center text-sm italic">
        <ThumbsUp className="inline w-5 h-5 mr-1 text-green-500" />
        No negative feedback found in this period. Great job!
      </div>
    ) : (
      <div className="space-y-4">
        {negativeFeedbackList.map((fb, i) => (
          <article
            key={i}
            className="p-4 rounded-lg border border-red-100 bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {renderStars(fb.rating)}
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(fb.createdAt)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic border-l-4 border-red-400 pl-3 leading-relaxed">
              "{fb.feedback}"
            </p>
          </article>
        ))}
      </div>
    )}
  </SectionCard>
);

/* -------------------------
   Profile Link CTA
   -------------------------*/
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied!");
    } catch (err) {
      toast.error("Could not copy link");
    }
  };

  return (
    <SectionCard
      className="mb-4"
      title="View My Profile"
      subtitle="See how your profile appears to visitors."
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-600 truncate max-w-[380px]">
            {profileUrl}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => window.open(profileUrl, "_blank")}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-sm"
            >
              <ExternalLink className="w-4 h-4" /> Open Profile
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>

        <div className="min-w-[48px] min-h-[48px] bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
          <Globe className="w-5 h-5" />
        </div>
      </div>
    </SectionCard>
  );
};

/* -------------------------
   Leads grid for individual
   -------------------------*/
const LeadsGrid = ({ leads = [], totalLeads = 0 }) => {
  if (!leads || leads.length === 0) {
    return (
      <SectionCard title="Business Leads">
        <EmptyState
          icon={User}
          title="No leads found"
          subtitle="No leads for this period."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Business Leads" subtitle={`${totalLeads} Leads`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                  {initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {lead.leadName || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500">Lead Contact</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    Met at:{" "}
                    <span className="font-medium">
                      {lead.placeWeMet || "-"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a
                    href={`tel:${lead.contactNumber?.phoneNumber ?? ""}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {lead.contactNumber?.phoneNumber ?? "—"}
                  </a>
                </div>

                {lead.note && (
                  <p className="text-xs text-gray-600 italic border-l-4 border-blue-300 pl-3">
                    "{lead.note}"
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  {formatDate(lead.createdAt)}
                </span>
                <a
                  href={`https://wa.me/${(
                    lead.contactNumber?.dialCode ?? ""
                  ).replace("+", "")}${lead.contactNumber?.phoneNumber ?? ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-green-600 font-medium hover:underline"
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

/* -------------------------
   Main Page
   -------------------------*/
export default function ProfileAnalyticsDashboard() {
  const userId = useAuthStore((state) => state.userId);
  const { user } = useUserDetailStore();
  const accountType = user?.accountType ?? "individual";
  const isBusiness = accountType === "business";
  const isIndividual = accountType === "individual";
  console.log(userId);

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
  const leads = data.leads?.list ?? [];
  const totalLeads = data.leads?.total ?? 0;

  const kpiData = useMemo(() => {
    const arr = [
      {
        title: "Total Profile Views",
        value: views.toLocaleString(),
        // change: "+12.5%",
        trend: "up",
        icon: Eye,
        color: "blue",
      },
      {
        title: "Social Media Interactions",
        value: (social.total ?? 0).toLocaleString(),
        // change: "+8.2%",
        trend: "up",
        icon: Globe,
        color: "purple",
      },
      {
        title: "Contact Actions",
        value: (contact.total ?? 0).toLocaleString(),
        // change: "+15.3%",
        trend: "up",
        icon: Phone,
        color: "green",
      },
    ];

    if (isBusiness) {
      arr.push(
        {
          title: "Average Rating",
          value: ratings.average,
          // change: "+0.3",
          trend: "up",
          icon: Star,
          color: "yellow",
          valueColor: "text-yellow-600",
        },
        {
          title: "Private Negative Reviews",
          value: ratings.negativeReviews.toLocaleString(),
          // change: "-18.2%",
          trend: "down",
          icon: AlertTriangle,
          color: "red",
        }
      );
    }

    if (isIndividual) {
      arr.push({
        title: "Total Connections",
        value: (totalLeads ?? 0).toLocaleString(),
        trend: "up",
        // change: "+7.0%",
        icon: User,
        color: "orange",
      });
    }

    return arr;
  }, [
    views,
    social.total,
    contact.total,
    ratings.average,
    ratings.negativeReviews,
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
    // stable-ish hash color generator for platform slices
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + (value & 0xff).toString(16)).slice(-2);
    }
    return color;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 p-8 bg-white rounded-xl shadow-lg">
          Please sign in to view analytics.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <DashboardHeader range={range} setRange={setRange} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Spinner
            label={`Loading Analytics for ${range.replace("_", " ")}...`}
          />
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
    <>
      <title>Dashboard</title>
      <div className="min-h-screen bg-gray-50 font-sans">
        <DashboardHeader range={range} setRange={setRange} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ProfileLink user={user} />

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
                  Add or update your business details, branding, and
                  preferences.
                </p>
              </div>
              <div className="min-w-[48px] min-h-[48px] bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
                <ChevronDown className="w-5 h-5 rotate-270" />
              </div>
            </div>
          </section>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              {isBusiness && (
                <RatingDistributionChart
                  ratingDistribution={ratingDistribution}
                  totalReviews={ratings.totalReviews}
                />
              )}
              <TrendLineChart
                isIndividual={isIndividual}
                lineChartData={lineChartData}
              />
            </div>

            <SocialPieChart socialChartData={socialChartData} />
          </div>

          {isBusiness && (
            <NegativeFeedbackList negativeFeedbackList={negativeFeedbackList} />
          )}

          {isIndividual && <LeadsGrid leads={leads} totalLeads={totalLeads} />}

          <footer className="mt-10 pt-6 border-t text-gray-500 text-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <span>Updated {new Date().toLocaleString()}</span>
              <span>Powered by Synconnect Analytics</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
