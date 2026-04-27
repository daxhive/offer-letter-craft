export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#2563eb",
            marginBottom: "12px",
          }}
        >
          LuxeHR Deployment Success 🚀
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#4b5563",
          }}
        >
          Frontend deployed successfully on Vercel
        </p>
      </div>
    </div>
  );
}
