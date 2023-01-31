import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { HiOutlineSun, HiOutlineMoon, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'
import { ThemeContext } from 'styled-components'
import { useAuthContext } from '../context/AuthContext'
import { useChatContext } from '../context/ChatContext'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'


function Navbar() {
  const { mode, setMode } = useContext(ThemeContext)
  const { user, setUser } = useAuthContext() 
  const { setChatInfo } = useChatContext() 
  const navigate = useNavigate()

  const { socketValue: { socketId, onlineUsers }, socketEmitEvent } = useSocket()
  const [ show, setShow ] = useState(false)

  useEffect(() => {
    console.log('socket id', socketId)
    if (socketId) {
      setShow(true)
      socketEmitEvent.test()
    }
  }, [socketId])

  const handleLogout = () => {
    setUser(null)
    // TODO: 登出先一律清空(localStorage 不紀錄上一次聊天對象)
    setChatInfo(null)
    socketEmitEvent.userOffline(user._id)
  }

  return (
    <NavContainer>
      <NavLogo onClick={() => navigate('/')}>
        <NavImage src="/talking.png" alt="brand=logo" />
        <NavBrand>ChatBot</NavBrand>
        { show && <h1>{socketId}</h1>}
        { show && onlineUsers && <p> 訪客人數：{ onlineUsers.length || 0}</p> }
      </NavLogo>
      { user ? <NavUser>Welcome! <span>{user.name}</span></NavUser> : null }
      <NavIcons>
        <NavIcon>
          { 
            mode === 'light'
            ? <HiOutlineSun onClick={() => setMode('dark')} />
            : <HiOutlineMoon onClick={() => setMode('light')} />
          }
        </NavIcon>
        {
          user ? (
            <NavIcon>
              <HiOutlineArrowTopRightOnSquare onClick={handleLogout} />
            </NavIcon>
          ) : null
        }
      </NavIcons>
    </NavContainer>
  )
}

const NavContainer = styled.nav `
  height: 80px;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: var(--bg-color-darken);
`

const NavLogo = styled.div `
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const NavImage = styled.img `
  display: block;
  width: 40px;
  height: 40px;
  object-fit: cover;
`

const NavBrand = styled.h1 `
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 1px;
`

const NavUser = styled.h2 `
  flex: 1;
  font-size: 1rem;
  text-align: end;
  margin-right: 0.5rem;
  padding: 0 1rem;
  text-transform: capitalize;
  
  span {
    font-style: italic;
  }
`

const NavIcons = styled.div `
  display: flex;
  align-items: center;
`

const NavIcon = styled.div `
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-color-main);
  cursor: pointer;
  
  :not(:last-child) {
    margin-right: 0.5rem;
  }
`

export default Navbar