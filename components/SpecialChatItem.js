import BQAnswer from "./BQAnswer"
import BurningQuestion from "./BurningQuestion"
import DeskItemThumbnail from "./DeskItemThumbnail"

const SpecialChatItem = ({ message, useCase, user }) => {
    switch (message.contentType) {
        case 'burning question': return <BurningQuestion
            useCase={useCase}
            bq={message.specialChatItem}
            disabled
        />
        case 'bq answer': return <BQAnswer
            useCase={useCase}
            answer={message.specialChatItem}
            disabled
        />
        case 'desk item': return <DeskItemThumbnail
            user={user}
            useCase={useCase}
            deskItem={message.specialChatItem}
            disabled
        />
        case 'poll':
        case 'game': return null
        default: return null
    }

}

export default SpecialChatItem