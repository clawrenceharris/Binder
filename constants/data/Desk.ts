import { auth } from "../../Firebase/firebase";

export default [


    {
        title: "SOHCAHTOA",
        section: "Section",
        sectionNumber: 2,
        cards: [{ cardFront: "Sine", cardBack: "Opposite / Hypotenuse" }, { cardFront: "Cosine", cardBack: "Adjacent / Hypotenuse" }, { cardFront: "Tangent", cardBack: "Opposite / Adjacent" }],
        isPublic: true,
        ownerUID: auth.currentUser.uid,
        id: "0",
        class: "Trigonometry"

    }
]