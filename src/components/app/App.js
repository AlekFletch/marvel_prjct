import AppHeader from "../appHeader/AppHeader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {MainPage,ComicsPage, Error} from "../pages";
import SinglePage from "../pages/SinglePage";
import SingleComicLayout from "../pages/singleComicLayout/SingleComicLayout";
import SingleCharacterLayout from "../pages/singleCharacterLayout/SingleCharacterLayout";

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path="/comics">
                        <ComicsPage/>
                        </Route>
                        <Route exact path="/comics/:id">
                            <SinglePage Component={SingleComicLayout} dataType='comic'/>
                        </Route>
                        <Route exact path="/characters/:id">
                            <SinglePage Component={SingleCharacterLayout} dataType='character'/>
                        </Route>
                        <Route exact path="/">
                        <MainPage/>
                        </Route>
                        <Route path="*">
                            <Error/>
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )

}

export default App;