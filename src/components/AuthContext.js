import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    getAuth,
    onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {

                try {

                    if (firebaseUser) {

                        // 🔥 Reload latest user state
                        await firebaseUser.reload();

                        const refreshedUser = auth.currentUser;

                        // ✅ Allow only verified users
                        if (refreshedUser?.emailVerified) {

                            setUser(refreshedUser);

                        } else {

                            setUser(null);

                        }

                    } else {

                        setUser(null);

                    }

                } catch (error) {

                    console.error('Auth state error:', error);

                    setUser(null);

                } finally {

                    setLoading(false);

                }

            }
        );

        return () => unsubscribe();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);