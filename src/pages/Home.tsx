import Card from "../components/ui/Card";
import Grid from "../components/ui/Grid";

const Home: React.FC = () => {


    return (
        <>
           {/* <button onClick={() => setDark(!dark)}>
                {dark ? "Light mode" : "Dark mode"}
            </button> */}
            <Grid>
                <Card title='Pending'>
                    Under maintanance
                </Card>
            </Grid>
        </>
    )
}

export default Home;