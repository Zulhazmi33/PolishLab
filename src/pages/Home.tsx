import Grid from "../components/ui/Grid";

const Home: React.FC = () => {

    function handleTesting() {
        console.log('hai ')
    }

    return (
        <>
            <Grid>
                <button onClick={handleTesting} className="bg-cyan-200 p-3 rounded-2xl cursor-pointer">
                    test
                </button>
            </Grid>
        </>
    )
}

export default Home;