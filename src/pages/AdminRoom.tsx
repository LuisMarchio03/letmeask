import { useParams } from 'react-router-dom';

import { database } from '../services/firebase';

import { useRoom } from '../hooks/useRoom';
// import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import logoImg from '../assets/images/logo.svg';
import logoImgDarkMode from '../assets/images/logo-dark-mode.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import Switch from 'react-switch';
import { shade } from 'polished';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import '../styles/pages/room.scss'; 
import { useDelete } from '../hooks/useDelete';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomID = params.id;
  
  const { toggleTheme, theme } = useTheme();
  const { title, questions } = useRoom(roomID)
  const { handleEndRoom } = useDelete(roomID)

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomID}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }
  
  return (
    <div id="page-room">
      <header>
        <div className="content">
          {theme === 'light' ? (
              <img src={logoImg} alt="Letmeask" />
            ) : (
              <img src={logoImgDarkMode} alt="Letmeask" />
          )}
          <div>
            <RoomCode code={roomID} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <Switch 
            onChange={toggleTheme}
            checked={theme === 'dark'}
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={50}
            handleDiameter={20}
            offColor={shade(0.15, "#e559f9")}
            onColor="#835afd"
          />
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>
        
       <div className="question-list">
        {questions.map(question => {
            return (
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta com respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                ) }

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
       </div>
      </main>
    </div>
  )
}