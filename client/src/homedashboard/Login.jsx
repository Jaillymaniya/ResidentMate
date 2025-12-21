import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { API_BASE } from "../api.jsx";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const blockToastShownRef = useRef(false);


  const navigate = useNavigate();

  // 🕒 OTP Countdown
  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  // 🟢 Normal Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`https://residentmate.onrender.com/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserEmailID: email,
          Password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // toast.success("✅ Login successful!", { position: "top-right" });
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);

        const roles = data.roles || [];

        if (roles.includes("Owner") && roles.includes("Secretory")) {
          localStorage.setItem("role", "OwnerSecretory");
          navigate("/role-selection");
        } else if (roles.includes("Admin")) {
          localStorage.setItem("role", "Admin");
          navigate("/admindashboard");
        } else if (roles.includes("Owner")) {
          localStorage.setItem("role", "Owner");
          navigate("/ownerdashboard");
        } else if (roles.includes("Secretory")) {
          localStorage.setItem("role", "Secretory");
          navigate("/secretorydashboard");
        } else if (roles.includes("Tenant")) {
          localStorage.setItem("role", "Tenant");
          navigate("/tenantdashboard");
        } else {
          setMessage("Role not recognized ❌");
        }
      } else {
        toast.error(data.message || "Invalid credentials ❌", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });

        // ✅ Trigger CAPTCHA and block logic only if password is wrong
        if (data.message && data.message.toLowerCase().includes("invalid")) {
          setLoginAttempts((prev) => {
            const newCount = prev + 1;

            // 🧩 Show CAPTCHA after 1st wrong password
            if (newCount === 1) {
              setShowCaptcha(true);
            }

            // 🚫 Disable login after 3 wrong password attempts
            if (newCount >= 3) {
              setIsBlocked(true);

              // ✅ Show toast only once even under React Strict Mode
              if (!blockToastShownRef.current) {
                blockToastShownRef.current = true; // mark as shown
                toast.error("🚫 Too many attempts! Try again after few seconds.", {
                  position: "top-right",
                  autoClose: 3000,
                  theme: "colored",
                });
              }

              // ⏳ Reset block & allow toast again after 10s
              setTimeout(() => {
                setIsBlocked(false);
                blockToastShownRef.current = false; // reset ref for next cycle
              }, 10000);

              return 0; // reset attempts
            }


            return newCount;
          });
        }

      }


    } catch (error) {
      // setMessage("Server error ❌");
      toast.error("Server error ❌", error, { position: "top-right" });
    }
  };

  // 🟠 Send OTP
  const handleSendOtp = async () => {
    if (!email) return setMessage("Please enter your email first");

    setMessage("Sending OTP...");
    try {
      const res = await fetch(`https://residentmate.onrender.com/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setTimer(60); // OTP valid for 60 seconds
        setOtpExpired(false);
        setMessage("✅ OTP sent to your email! It expires in 60 seconds.");
      } else {
        setMessage(data.message || "Failed to send OTP ❌");
      }
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  // 🔵 Resend OTP
  const handleResendOtp = () => {
    if (timer === 0) handleSendOtp();
  };

  // 🟣 Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword)
      return setMessage("Please enter OTP and new password");

    try {
      const res = await fetch(`https://residentmate.onrender.com/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful! Please login again.");
        setIsForgot(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
      } else {
        setMessage(data.message || "Invalid or expired OTP ❌");
      }
    } catch (err) {
      setMessage("Server error ❌");
    }
  };

  // 🎨 Styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
      padding: "20px",
      marginBottom: "20px",
      marginLeft: "560px",
    },
    card: {
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "2.5rem",
      width: "350px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
      color: "#fff",
      marginTop: "15px",
      marginBottom: "30px",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      textAlign: "center",
      letterSpacing: "1px",
      color: "#507ba3ff",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      margin: "10px 0",
      borderRadius: "10px",
      border: "none",
      outline: "none",
      fontSize: "1rem",
      background: "rgba(255, 255, 255, 0.2)",
      color: "#0a0a0bff",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "15px",
      borderRadius: "10px",
      border: "none",
      fontSize: "1rem",
      fontWeight: "bold",
      // background: "linear-gradient(135deg, #7b57abff, #ff5e62)",
      background: "linear-gradient(135deg, #0b3c91, #00b894)",
      color: "#fff",
      cursor: "pointer",
      transition: "0.3s",
    },
    link: {
      display: "block",
      marginTop: "15px",
      textAlign: "center",
      color: "#6970dcff",
      fontSize: "0.9rem",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {!isForgot ? (
        // 🟢 LOGIN FORM
        <form style={styles.card} onSubmit={handleLogin}>
          <h2 style={styles.title}>Welcome Back</h2>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {/* <button type="submit" style={styles.button}>
            Login
          </button> */}
          <button type="submit" style={styles.button} disabled={isBlocked}>
            {isBlocked ? "Try Again Later..." : "Login"}
          </button>

          <a onClick={() => setIsForgot(true)} style={styles.link}>
            Forgot Password?
          </a>
        </form>
      ) : (
        // 🟣 FORGOT PASSWORD FORM
        <form
          style={styles.card}
          onSubmit={otpSent ? handleResetPassword : (e) => e.preventDefault()}
        >
          <h2 style={styles.title}>Reset Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={otpSent}
          />

          {!otpSent ? (
            <button type="button" onClick={handleSendOtp} style={styles.button}>
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Reset Password
              </button>

              {/* 🔥 Timer and Resend logic */}
              <p style={{ textAlign: "center", marginTop: "10px", color: otpExpired ? "red" : "blue" }}>
                {timer > 0 ? (
                  <span>⏳ OTP expires in {timer}s</span>
                ) : otpExpired ? (
                  <span style={{ color: "red" }}>
                    ❌ OTP expired!{" "}
                    <a onClick={handleResendOtp} style={styles.link}>
                      Resend OTP
                    </a>
                  </span>
                ) : (
                  <a onClick={handleResendOtp} style={styles.link}>
                    Resend OTP
                  </a>
                )}
              </p>
            </>
          )}

          <a onClick={() => setIsForgot(false)} style={styles.link}>
            Back to Login
          </a>
        </form>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
      {showCaptcha && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px 40px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <p style={{ color: "#333", marginBottom: "10px" }}>
              Please verify: I am not a robot 🤖
            </p>
            <label style={{ color: "#333" }}>
              <input
                type="checkbox"
                onChange={(e) => e.target.checked && setShowCaptcha(false)}
              />{" "}
              I'm not a robot
            </label>
          </div>
        </div>
      )}

    </div>

  );
}
