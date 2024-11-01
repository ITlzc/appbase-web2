import '../styles/footer.scss'

export default function Footer() {
    return (
        <div className="footer_ flex-row">
            <img
                className="image_18"
                src={"/images/logo_white.png"}
            />
            <span className="text_75">Pricacy</span>
            <span className="text_76">Terms</span>
            <span className="text_77">Copyright</span>
            <img
                className="image_19"
                src={"/images/x.svg"}
            />

            <img
                className="image_21"
                src={"/images/Metamask_icon.svg"}
            />

            <img
                className="image_21"
                src={"/images/telegram_icon.svg"}
            />
        </div>
    )
}