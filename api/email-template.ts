/**
 * Welcome email template for Aurium waitlist
 * Custom branded template with full vision and feature descriptions
 */
export function getWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aurium Waitlist</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background-color: #e8e8e8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .container {
            background-color: #ffffff;
            max-width: 720px;
            width: 100%;
            border-radius: 20px;
            padding: 60px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 40px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background-color: #101f1c;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
        }
        
        .logo-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .logo-text {
            font-size: 42px;
            font-weight: 300;
            color: #101f1c;
            letter-spacing: -1px;
        }
        
        p {
            font-size: 18px;
            line-height: 1.7;
            color: #101f1c;
            margin-bottom: 28px;
        }
        
        .emphasis {
            font-style: italic;
            font-size: 20px;
            margin: 35px 0;
        }
        
        .highlight {
            background-color: #fdf00e;
            padding: 2px 6px;
            border-radius: 3px;
        }
        
        h2 {
            font-size: 26px;
            font-weight: 600;
            color: #101f1c;
            margin: 45px 0 25px 0;
            letter-spacing: -0.5px;
        }
        
        .feature {
            margin-bottom: 30px;
        }
        
        .feature-title {
            font-weight: 600;
            color: #101f1c;
            margin-bottom: 8px;
        }
        
        .signature {
            margin-top: 50px;
            font-style: italic;
            color: #101f1c;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-icon">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23fdf00e' d='M50 5 L95 85 L80 85 L50 35 L50 85 L35 85 L35 35 L5 85 L5 85 L20 85 L50 35 L50 5 M35 85 L20 85 L35 60 Z'/%3E%3C/svg%3E" alt="Aurium Logo">
            </div>
            <div class="logo-text">Aurium</div>
        </div>
        
        <p>You've successfully joined the Aurium waitlist.</p>
        
        <p>You'll be the first to hear when we are ready to bring new users on.</p>
        
        <p>If you're a developer, investor, or early adopter who believes in the future of decentralized finance, stick around to the end... we want to give you early access and work with you.</p>
        
        <p>Until then, we have something to say:</p>
        
        <p class="emphasis">Traditional wealth management is dying.</p>
        
        <p>Financial advisors promised personalized guidance, but most people can't afford their high fees and minimums.</p>
        
        <p>Robo-advisors promised automation, but they're rigid, centralized, and lack true intelligence.</p>
        
        <p>The crypto revolution gave us financial sovereignty, but left most people without guidance on how to manage it.</p>
        
        <p>We're drowning in financial products. More tokens. More noise. More risk. People are getting tired of it.</p>
        
        <p><span class="highlight">Intelligence has become a survival skill.</span> When anyone can invest in anything, smart portfolio management becomes your competitive edge.</p>
        
        <p>Curation is the deliberate choice to say no to hype in favor of the strategic.</p>
        
        <p>You have the capital. You have the vision. But you lack the tools that amplify your financial intelligence.</p>
        
        <p>Traditional robo-advisors are stuck in Web2, charging fees while holding your assets hostage.</p>
        
        <p>Crypto wallets give you control, but zero intelligence about what to do with your assets.</p>
        
        <p>Financial news feeds overwhelm you with information, but provide no actionable strategy.</p>
        
        <p>AI is the most powerful technology we've experienced, but it's not integrated into your financial decision-making.</p>
        
        <p>You end up with 10 different tabs open. Portfolio tracker in one tab, market analysis in another, 4 different research articles, a wallet interface, and maybe a few whitepapers you'll never finish reading.</p>
        
        <p>Today's wealth management tools hurt your financial growth more than they help it, and most people are blind to this. They don't care because there isn't a better solution.</p>
        
        <h2>Aurium – Pioneering The Future Of Decentralized Wealth</h2>
        
        <p>The future belongs to the strategic, not the speculators. Builders, not gamblers. Gardeners of wealth, not chasers of pumps.</p>
        
        <p>Our mission is to create an intelligent platform with three key features:</p>
        
        <div class="feature">
            <p class="feature-title">1) AI-Powered Intelligence.</p>
            <p>Aurium uses advanced artificial intelligence to analyze market conditions, assess risk, and optimize your portfolio 24/7. Our AI learns from global market data, on-chain analytics, and emerging trends to make informed decisions that traditional advisors and simple algorithms can't match.</p>
        </div>
        
        <div class="feature">
            <p class="feature-title">2) Truly Decentralized.</p>
            <p>Your assets never leave your control. Aurium operates through smart contracts on the blockchain, meaning no central authority can freeze, seize, or mismanage your wealth. You maintain full custody while benefiting from institutional-grade portfolio management. Transparent. Auditable. Unstoppable.</p>
        </div>
        
        <div class="feature">
            <p class="feature-title">3) Accessible To Everyone.</p>
            <p>No minimum investment. No hidden fees. No geographic restrictions. Whether you're starting with $100 or $100,000, Aurium provides the same sophisticated strategies that were once reserved for the ultra-wealthy. Your financial future shouldn't depend on how much you already have.</p>
        </div>
        
        <p>Here's the thing: AI has given us superpowers, and blockchain has given us freedom. Aurium brings them together.</p>
        
        <p>You don't need a $1M minimum to access quality wealth management. You don't need to trust a centralized platform with your life savings. You don't need a PhD in finance to build lasting wealth.</p>
        
        <p>Aurium is your intelligent partner in the decentralized economy. It rebalances automatically. It hedges against volatility. It captures opportunities while you sleep. All while your assets remain completely under your control.</p>
        
        <p>The old world required you to be rich to build wealth. The new world requires you to be early. You're early.</p>
        
        <p class="signature">Thank you for being here at the start of Aurium. We can't wait for you to experience the future of wealth management.</p>
        
        <p class="signature">– The Aurium Team</p>
    </div>
</body>
</html>
  `.trim();
}
