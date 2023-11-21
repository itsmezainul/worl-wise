import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  user: null,
  isAuthorized: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthorized: true, user: FAKE_USER };
    case "logout":
      return { ...state, isAuthorized: false, user: null };
    default:
      throw new Error("Unkown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthorized }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login" });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthorized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("use authProvider outside of context");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
