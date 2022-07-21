import Browser
import Html exposing (..)


main: Program Int Model Msg
main = Browser.element {
    init = init,
    view = view,
    update = update,
    subscriptions = subscriptions
}

type Page = Main | Contact
type alias Model = { currentPage: Page }

init: () -> ( Model, Cmd Msg )
init =
    ( { currentPage = Main }, Cmd.none )


type Msg = ChangePage Page

update: Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangePage page -> 
            ( { model | currentPage = page }, Cmd.none )


view: Model -> Html Msg
view model =
    case model.currentPage of
        Main -> renderMain model
        Contact -> renderContact model


renderMain: Model -> Html Msg
renderMain model = div [] [
    h1 [] [ text "Main page"]
    button [onClick ChangePage Contact] [ text "Go to Contact" ]
]

renderContact: Model -> Html Msg
renderContact model = div [] [
    h1 [] [ text "Contact page" ]
    button [onClick ChangePage Main] [ text "Go to Main" ]
]
