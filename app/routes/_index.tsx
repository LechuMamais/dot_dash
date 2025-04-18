import { Link } from '@remix-run/react';
import levels from '../utils/levels.js';

export default function Index() {
  return (
    <div>
      <h1>Selecciona un nivel:</h1>
      <ul>
        {levels.map(level => (
          <li key={level.id}>
            <Link to={`/game/${level.id}`}>{`Nivel ${level.id}`}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
