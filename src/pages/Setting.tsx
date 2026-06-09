import { useEffect, useState } from "react";
import { UserIcon } from "../assets/SVG/General_icon";

// ---- Types ----
interface ToggleProps {
    enabled: boolean;
    onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
      transition-[background-color] duration-1000 ease-in-out
      ${enabled ? "bg-primary" : "bg-gray-200"}`}
    aria-checked={enabled}
    role="switch"
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
        transition-transform duration-1000 ease-in-out
        ${enabled ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

// ---- Section wrapper ----
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">{title}</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {children}
        </div>
    </div>
);

// ---- Row variants ----
const RowToggle: React.FC<{icon: string; label: string; sub?: string; enabled: boolean; onChange: () => void}> = ({ icon, label, sub, enabled, onChange }) => (
  <div className="flex items-center gap-3 px-4 py-3.5">
    <span className="text-xl w-7 text-center">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <Toggle enabled={enabled} onChange={onChange} />
  </div>
);

const RowNav: React.FC<{ icon: string; label: string; sub?: string; value?: string; onClick?: () => void }> = ({
    icon, label, sub, value, onClick
}) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left focus:outline-none">
        <span className="text-xl w-7 text-center">{icon}</span>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-xs text-gray-400">{value}</span>}
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </button>
);

// ---- Main page ----
const Settings: React.FC = () => {

    // ------------------------------------------ 1) useState ------------------------------------------
        // toggles
        // const [notifications, setNotifications]     = useState(true);
        // const [orderUpdates, setOrderUpdates]        = useState(true);
        // const [promotions, setPromotions]            = useState(false);
        const [darkMode, setDarkMode]                = useState(false);
        // const [biometric, setBiometric]              = useState(true);
        // const [locationAccess, setLocationAccess]    = useState(true);
        // const [formUser, setForm_user] = useState( {
        const [formUser, ] = useState( {
            name: 'Raja Ahmad Zulhazmi',
            email: 'hazmi1ab@gmail.com',
            // phoneNo: ''
            image: '',
        })


    // ------------------------------------------ 2) method ------------------------------------------
        const handleDarkmode = () => {
            const root = document.documentElement;

            if (darkMode) {
                root.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                root.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        }
        // const handleLogout = async () => {
        //     try {
        //         await signOut(auth);
        //         // optional: clear cached user info
        //         localStorage.removeItem("user");
        //         // navigate("/login");
        //     } catch (error) {
        //         console.error("Logout error:", error);
        //     }
        // }


    // ------------------------------------------ 3) useEffect ------------------------------------------
        // 1) dark mode
        useEffect(() => {
            handleDarkmode()
        }, [darkMode])
        // 2) profile
        // useEffect(() => {
        //     const user = auth.currentUser;
        //     console.log('user = ',user);

        //     setForm_user( {
        //         name: user?.displayName || 'No name set',
        //         email: user?.email || 'No email set',
        //         image: user?.photoURL || ''
        //     })
        // }, [])

        
    return (
        <div className="max-w-lg mx-auto px-4 py-6">

            {/* ---- Profile card ---- */}
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-8">
              
            {formUser.image ? (
                <img
                    src={formUser.image}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                />
                ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon/>
                </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-800">{formUser.name}</p>
                    <p className="text-xs text-gray-400">{formUser.email}</p>
                    <p className="text-xs text-gray-400">+60 12-345 6789</p>
                </div>
                <button className="text-xs font-medium text-primary border border-primary rounded-full px-3 py-1.5
                                   hover:bg-primary hover:text-white transition-colors focus:outline-none">
                    Edit
                </button>
            </div>

            {/* ---- Account ---- */}
            {/* <Section title="Account">
                <RowNav icon="👤" label="Personal Info"        sub="Name, email, phone"         />
                <RowNav icon="📍" label="Saved Addresses"      sub="Home, office & more"        />
                <RowNav icon="💳" label="Payment Methods"      sub="Cards & e-wallets"          />
                <RowNav icon="🔒" label="Change Password"                                       />
            </Section> */}

            {/* ---- Notifications ---- */}
            {/* <Section title="Notifications"> */}
                {/* <RowToggle icon="🔔" label="Push Notifications"   sub="App alerts & reminders"  enabled={notifications}  onChange={() => setNotifications(v => !v)}  /> */}
                {/* <RowToggle icon="📦" label="Order Updates"        sub="Shipping & delivery"     enabled={orderUpdates}   onChange={() => setOrderUpdates(v => !v)}   /> */}
                {/* <RowToggle icon="🎁" label="Promotions & Deals"   sub="Sales and vouchers"      enabled={promotions}     onChange={() => setPromotions(v => !v)}     /> */}
            {/* </Section> */}

            {/* ---- Preferences ---- */}
            <Section title="Preferences">
                <RowToggle icon="🌙" label="Dark Mode"            sub="Switch app theme"        enabled={darkMode}       onChange={() => setDarkMode(v => !v)}       />
                {/* <RowNav    icon="🌐" label="Language"             value="English"                                        /> */}
                {/* <RowNav    icon="💱" label="Currency"             value="MYR (RM)"                                       /> */}
            </Section>

            {/* ---- Privacy & Security ---- */}
            <Section title="Privacy & Security">
                {/* <RowToggle icon="👆" label="Biometric Login"      sub="Face ID / Fingerprint"   enabled={biometric}      onChange={() => setBiometric(v => !v)}      /> */}
                {/* <RowToggle icon="📡" label="Location Access"      sub="For delivery tracking"   enabled={locationAccess} onChange={() => setLocationAccess(v => !v)} /> */}
                <RowNav    icon="🛡️" label="Privacy Policy"                                                              />
                <RowNav    icon="📄" label="Terms of Service"                                                            />
            </Section>

            {/* ---- Support ---- */}
            <Section title="Support">
                {/* <RowNav icon="💬" label="Help & FAQ"             /> */}
                <RowNav icon="📞" label="Contact Us"             />
                <RowNav icon="⭐" label="Rate the App"           />
            </Section>

            {/* ---- Logout ---- */}
            {/* <button onClick={handleLogout} className="py-3 w-full rounded-2xl bg-red-700 text-white text-sm font-medium transition-all cursor-pointer"> */}
            <button className="py-3 w-full rounded-2xl bg-red-700 text-white text-sm font-medium transition-all cursor-pointer">
                Log Out
            </button>
        </div>
    );
};

export default Settings;