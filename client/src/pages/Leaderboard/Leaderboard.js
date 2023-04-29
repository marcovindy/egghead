import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, ButtonGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext';
import { Link } from 'react-router-dom';
import t from "../../i18nProvider/translate";
const Leaderboard = () => {
    const API_URL =
        process.env.NODE_ENV === 'production'
            ? 'https://testing-egg.herokuapp.com'
            : 'http://localhost:5000';
    const [users, setUsers] = useState([]);
    const { authState } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(authState);
    const [sortBy, setSortBy] = useState('level');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCurrentUser(authState);
        fetchLeaderboard();
        axios
            .get(`${API_URL}/auth/user/byusername/${authState.username}`)
            .then((response) => {
                setCurrentUser(response.data);
            })
            .catch((error) => console.log(error));
    }, [API_URL, authState, sortBy]);

    const fetchLeaderboard = () => {
        setIsLoading(true);
        axios
            .get(`${API_URL}/auth/leaderboard`, {
                params: {
                    sortBy: sortBy,
                },
            })
            .then((response) => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const isUserInTop10 = () => {
        return users.some((user) => user.id === currentUser.id);
    };

    const highlightUserRow = (user) => {
        return user.id === currentUser.id ? { backgroundColor: '#a6e4ff' } : {};
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        fetchLeaderboard();
    };

    return (
        <Container>
            <h2>{t('Leaderboard')}</h2>
            <ButtonGroup className='mb-3'>
                <Button
                    variant='primary'
                    onClick={() => handleSortChange('rank')}
                    active={sortBy === 'rank'}
                    disabled={isLoading}
                >
                    {t('Sort by Rank')}
                </Button>
                <Button
                    variant='primary'
                    onClick={() => handleSortChange('level')}
                    active={sortBy === 'level'}
                    disabled={isLoading}
                >
                    {t('Sort by Level')}
                </Button>
            </ButtonGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('Username')}</th>
                        <th>{t('Level')}</th>
                        <th>{t('Experience')}</th>
                        <th>{t('Ranked score')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users &&
                        users.slice(0, 10).map((user, index) => (
                            <tr key={user.id} style={highlightUserRow(user)}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/profile/${user.username}`}>{user.username}</Link>
                                </td>
                                <td>{user.level}</td>
                                <td>{user.experience}</td>
                                <td>{user.rank}</td>
                            </tr>
                        ))}
                    {/* Zde zobrazte řádek pro aktuálně přihlášeného uživatele */}
                    {!isUserInTop10() && (
                        <tr style={{ backgroundColor: '#a6e4ff' }}>
                            <td>You</td>
                            <td>
                                <Link to={`/profile/${currentUser.username}`}>
                                    {currentUser.username}
                                </Link>
                            </td>
                            <td>{currentUser.level}</td>
                            <td>{currentUser.experience}</td>
                            <td>{currentUser.rank}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default Leaderboard;
