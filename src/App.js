// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { SnackbarProvider } from 'notistack';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <ThemeCustomization>
      <SnackbarProvider>
        <ScrollTop>
            <Routes />
        </ScrollTop>
      </SnackbarProvider>
    </ThemeCustomization>
);

export default App;
