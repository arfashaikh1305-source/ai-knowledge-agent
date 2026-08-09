import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../services/api";
import { getToken } from "../services/auth";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setChart(null);

    try {
      const token = getToken();

      const response = await api.post(
        "/chat/",
        {
          question: question.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(response.data.answer || "");
      setChart(response.data.chart || null);
    } catch (err) {
      console.error("Chat error:", err);

      if (err.response?.status === 401) {
        setError("Your login session has expired. Please login again.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to connect to the AI server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    chart?.labels?.map((label, index) => ({
      name: label,
      value: Number(chart.values[index]),
    })) || [];

  const renderChart = () => {
    if (!chart || chartData.length === 0) {
      return null;
    }

    if (chart.type === "line") {
      return (
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <span style={styles.chartBadge}>ANALYTICS</span>
              <h3 style={styles.chartTitle}>{chart.title}</h3>
            </div>
          </div>

          <div style={styles.chartArea}>
            <ResponsiveContainer width="100%" height={420}>
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 25,
                  left: 0,
                  bottom: 80,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={90}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="value"
                  name="Value"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#6366f1",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (chart.type === "pie") {
      const pieColors = [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f97316",
        "#06b6d4",
        "#10b981",
        "#eab308",
        "#ef4444",
      ];

      return (
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <span style={styles.chartBadge}>DISTRIBUTION</span>
              <h3 style={styles.chartTitle}>{chart.title}</h3>
            </div>
          </div>

          <div style={styles.chartArea}>
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  outerRadius={145}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <span style={styles.chartBadge}>ANALYTICS</span>
            <h3 style={styles.chartTitle}>{chart.title}</h3>
          </div>

          <span style={styles.chartIcon}>📊</span>
        </div>

        <div style={styles.chartArea}>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 25,
                left: 0,
                bottom: 100,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={120}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                name="Issues"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>✦</div>

          <div>
            <div style={styles.logoTitle}>
              AI Knowledge
            </div>

            <div style={styles.logoSubtitle}>
              AGENT
            </div>
          </div>
        </div>

        <div style={styles.sidebarLabel}>
          WORKSPACE
        </div>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navItem}>
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/documents" style={styles.navItem}>
            <span>▣</span>
            Documents
          </Link>

          <Link
            to="/chat"
            style={{
              ...styles.navItem,
              ...styles.activeNav,
            }}
          >
            <span>✦</span>
            AI Chat
            <span style={styles.activeDot}></span>
          </Link>
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.knowledgeCard}>
            <div style={styles.knowledgeIcon}>⚡</div>

            <div>
              <div style={styles.knowledgeTitle}>
                Knowledge AI
              </div>

              <div style={styles.knowledgeText}>
                Ask questions from your documents.
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topbar}>
          <div>
            <div style={styles.breadcrumb}>
              Workspace / AI Chat
            </div>

            <h1 style={styles.pageTitle}>
              AI Knowledge Assistant
            </h1>
          </div>

          <div style={styles.status}>
            <span style={styles.statusDot}></span>
            AI Online
          </div>
        </header>

        {/* Chat content */}
        <section style={styles.content}>
          <div style={styles.hero}>
            <div style={styles.heroIcon}>✦</div>

            <div>
              <h2 style={styles.heroTitle}>
                Ask your documents anything
              </h2>

              <p style={styles.heroText}>
                Get intelligent answers from your uploaded
                knowledge base with AI-powered search.
              </p>
            </div>
          </div>

          {/* Question box */}
          <div style={styles.inputCard}>
            <div style={styles.inputHeader}>
              <span style={styles.inputLabel}>
                YOUR QUESTION
              </span>

              <span style={styles.shortcut}>
                Enter to send
              </span>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
              placeholder="Ask something about your uploaded documents..."
              rows={4}
              style={styles.textarea}
            />

            <div style={styles.inputFooter}>
              <span style={styles.hint}>
                Shift + Enter for a new line
              </span>

              <button
                onClick={askQuestion}
                disabled={loading}
                style={{
                  ...styles.askButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Thinking...
                  </>
                ) : (
                  <>
                    Ask AI
                    <span style={styles.sendIcon}>➜</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>!</span>
              <span>{error}</span>
            </div>
          )}

          {/* AI Answer */}
          {answer && (
            <div style={styles.answerCard}>
              <div style={styles.aiHeader}>
                <div style={styles.aiAvatar}>✦</div>

                <div>
                  <div style={styles.aiName}>
                    AI Knowledge Assistant
                  </div>

                  <div style={styles.aiStatus}>
                    Based on your uploaded documents
                  </div>
                </div>
              </div>

              <div style={styles.answerText}>
                {answer}
              </div>
            </div>
          )}

          {/* Chart */}
          {renderChart()}
        </section>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  sidebar: {
    width: "255px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 10px 30px",
  },

  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    boxShadow:
      "0 8px 20px rgba(99, 102, 241, 0.35)",
  },

  logoTitle: {
    fontSize: "17px",
    fontWeight: "700",
  },

  logoSubtitle: {
    fontSize: "10px",
    letterSpacing: "2px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  sidebarLabel: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    padding: "0 12px 10px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  navItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "13px 14px",
    borderRadius: "10px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },

  activeNav: {
    background:
      "linear-gradient(90deg, rgba(99,102,241,0.22), rgba(139,92,246,0.12))",
    color: "#ffffff",
  },

  activeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#818cf8",
    marginLeft: "auto",
    boxShadow: "0 0 8px #818cf8",
  },

  sidebarBottom: {
    marginTop: "auto",
  },

  knowledgeCard: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.07)",
  },

  knowledgeIcon: {
    fontSize: "18px",
  },

  knowledgeTitle: {
    fontSize: "12px",
    fontWeight: "600",
  },

  knowledgeText: {
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "1.5",
    marginTop: "3px",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  topbar: {
    minHeight: "88px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },

  breadcrumb: {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "5px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "700",
    color: "#0f172a",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 13px",
    borderRadius: "20px",
    background: "#f0fdf4",
    color: "#15803d",
    fontSize: "12px",
    fontWeight: "600",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    background: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 8px rgba(34,197,94,0.5)",
  },

  content: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    padding: "42px 30px 70px",
    boxSizing: "border-box",
  },

  hero: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },

  heroIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    boxShadow:
      "0 10px 25px rgba(99,102,241,0.25)",
  },

  heroTitle: {
    margin: 0,
    fontSize: "27px",
    fontWeight: "750",
    color: "#111827",
  },

  heroText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  inputCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.06)",
    marginBottom: "20px",
  },

  inputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  inputLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#6366f1",
  },

  shortcut: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  textarea: {
    width: "100%",
    minHeight: "125px",
    boxSizing: "border-box",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "15px",
    fontSize: "15px",
    color: "#1e293b",
    background: "#f8fafc",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  },

  inputFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "13px",
  },

  hint: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  askButton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    background:
      "linear-gradient(135deg, #6366f1, #7c3aed)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "650",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow:
      "0 7px 18px rgba(99,102,241,0.25)",
  },

  sendIcon: {
    fontSize: "17px",
  },

  spinner: {
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    display: "inline-block",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "13px",
  },

  errorIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  answerCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "24px",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.05)",
    marginBottom: "20px",
  },

  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  aiAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  aiName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  aiStatus: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  answerText: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
    paddingLeft: "54px",
  },

  chartCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "24px",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.05)",
  },

  chartHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5px",
  },

  chartBadge: {
    color: "#6366f1",
    fontSize: "10px",
    fontWeight: "750",
    letterSpacing: "1.5px",
  },

  chartTitle: {
    margin: "6px 0 0",
    fontSize: "19px",
    color: "#111827",
  },

  chartIcon: {
    fontSize: "25px",
  },

  chartArea: {
    width: "100%",
    height: "430px",
    marginTop: "15px",
  },
};

export default Chat;