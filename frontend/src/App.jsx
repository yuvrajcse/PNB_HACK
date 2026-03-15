import { useState } from 'react';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState("professional");
  const [investments, setInvestments] = useState(null);
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  
  // Default ticker for the graph
  const [activeTicker, setActiveTicker] = useState("NVDA"); 

  // --- 1. FRAUD ENGINE API CALL ---
  const handleTransfer = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/wealth/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100000 })
      });
      const data = await response.json();
      setStatus(data);
    } catch (error) { 
      alert("Backend Offline! Ensure Tomcat is running on 8080."); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- 2. INVESTMENT ENGINE API CALL ---
  const fetchInvestments = async () => {
    setLoadingInvestments(true);
    console.log("Fetching live recommendations...");
    try {
      const response = await fetch(`http://localhost:8080/api/wealth/groww-suggestions?profile=${userProfile}`);
      const data = await response.json();
      
      console.log("Data from Backend:", data);
      setInvestments(data);

      // Auto-switch graph to the first ticker returned by Finnhub
      if (data.stocks && data.stocks.length > 0) {
        setActiveTicker(data.stocks[0].ticker);
      }
    } catch (error) { 
      console.error("Fetch Error:", error);
      alert("Connection to Java Backend Failed!"); 
    } finally { 
      setLoadingInvestments(false); 
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SecureWealth Twin 🛡️</h1>
        <p style={styles.tagline}>Finnhub AI Sentiment Engine • PNB Security Protocol</p>
      </header>

      <div style={styles.dashboardGrid}>
        
        {/* LEFT COLUMN: Controls & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>🌐 AI Twin Recommendation Engine</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <select value={userProfile} onChange={(e) => setUserProfile(e.target.value)} style={styles.dropdown}>
                <option value="professional">Young Professional / High Risk</option>
                <option value="family">Family / Conservative</option>
              </select>
              <button onClick={fetchInvestments} style={styles.smallButton}>
                {loadingInvestments ? "Analyzing..." : "Scan Market"}
              </button>
            </div>

            {investments && (
              <div style={styles.investmentResults}>
                <p style={styles.strategyBadge}>{investments.strategy}</p>
                <h4 style={styles.assetTitle}>📈 Live AI Signals</h4>
                {investments.stocks.map((stock, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveTicker(stock.ticker)} 
                    style={{
                      ...styles.assetRow, 
                      backgroundColor: activeTicker === stock.ticker ? '#e3f2fd' : 'transparent',
                      borderLeft: activeTicker === stock.ticker ? '4px solid #004a99' : 'none'
                    }}
                  >
                    <span>{stock.name}</span> 
                    <span style={styles.positiveReturn}>{stock.return}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>🛡️ Execute Wealth Action</h2>
            <div style={{ lineHeight: '1.6' }}>
              <p>Action: <b>High-Value Transfer</b></p>
              <p>Value: <b style={{color: '#d32f2f'}}>₹1,00,000</b></p>
              <button onClick={handleTransfer} style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
                {loading ? "Verifying..." : "Confirm & Execute"}
              </button>
            </div>
            {status && (
              <div style={{...styles.resultCard, borderColor: '#d32f2f', backgroundColor: '#ffebee'}}>
                <h4 style={{ color: '#d32f2f', margin: '0 0 5px 0' }}>Status: {status.action}ED</h4>
                <p style={{fontSize: '12px', margin: 0}}>{status.message}</p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CHART */}
        <section style={{...styles.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
          <div style={{padding: '15px 20px 5px 20px'}}>
              <h2 style={styles.cardTitle}>📉 Live AI Market Foresight: {activeTicker}</h2>
          </div>
          <div style={{ height: '480px', width: '100%' }}>
              <iframe
                key={activeTicker}
                title="TradingView"
                src={`https://s.tradingview.com/widgetembed/?symbol=${activeTicker}&interval=D&theme=light&style=1&timezone=Etc%2FUTC`}
                width="100%" height="100%" frameBorder="0"
              ></iframe>
          </div>
        </section>
      </div>

      {/* BOTTOM SECTION: HABITS & GOALS */}
      <div style={{...styles.dashboardGrid, marginTop: '20px'}}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Spending Habit Insights</h2>
          <div style={styles.insightBox}>
            <p style={{fontSize: '13px', margin: 0}}><b>AI Twin Alert:</b> Lifestyle spending is 35% above average. This reduces your potential monthly SIP by ₹12,000.</p>
          </div>
          <div style={{marginTop: '10px'}}>
            <div style={styles.categoryRow}><span>Dining & Lifestyle</span> <span>35%</span></div>
            <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: '35%', background: '#d32f2f'}}></div></div>
            <div style={styles.categoryRow}><span>Investment Capacity</span> <span>25%</span></div>
            <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: '25%', background: '#2e7d32'}}></div></div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Financial Goals</h2>
          <div style={styles.categoryRow}><span><b>Home Downpayment</b></span> <span>75%</span></div>
          <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: '75%', background: '#004a99'}}></div></div>
          <div style={styles.categoryRow}><span style={{marginTop: '10px'}}><b>Emergency Fund</b></span> <span style={{marginTop: '10px'}}>60%</span></div>
          <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: '60%', background: '#f39c12'}}></div></div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid #004a99' },
  logo: { color: '#004a99', margin: 0 },
  tagline: { color: '#666', fontSize: '14px' },
  dashboardGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px', maxWidth: '1300px', margin: '0 auto' },
  card: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  cardTitle: { color: '#004a99', fontSize: '16px', margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#004a99', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  buttonDisabled: { width: '100%', padding: '12px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '6px' },
  smallButton: { padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  dropdown: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 },
  resultCard: { marginTop: '15px', padding: '10px', borderRadius: '8px', border: '1px solid' },
  investmentResults: { background: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  strategyBadge: { display: 'inline-block', background: '#e3f2fd', color: '#004a99', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' },
  assetTitle: { margin: '0 0 10px 0', fontSize: '14px', color: '#333' },
  assetRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 10px', borderBottom: '1px solid #eee', fontSize: '13px', cursor: 'pointer', transition: '0.2s' },
  positiveReturn: { color: '#2e7d32', fontWeight: 'bold' },
  insightBox: { background: '#fff3e0', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #ff9800' },
  categoryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' },
  progressBarBg: { width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' },
  progressBarFill: { height: '100%', borderRadius: '4px' }
};

export default App;