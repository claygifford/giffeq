import NavigationBar from "./navigation-bar/navigation-bar";

const SiteLayout = ({ children }) => (
  <div>
    <NavigationBar />
    <div className="container">
        {children}
    </div>
  </div>
);

export default SiteLayout;