import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import classnames from 'classnames';
import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { List, ListItem } from '.';
import { selectArchivedListLoading } from '../slice/selectors';
import { getArchivedSources } from '../slice/thunks';
import { Source } from '../slice/types';

interface RecycleProps {
  sourceId?: string;
  list?: Source[];
}

export const Recycle = memo(({ sourceId, list }: RecycleProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectArchivedListLoading);
  const orgId = useSelector(selectOrgId);

  useEffect(() => {
    dispatch(getArchivedSources(orgId));
  }, [dispatch, orgId]);

  const toDetail = useCallback(
    id => () => {
      history.push(`/organizations/${orgId}/sources/${id}`);
    },
    [history, orgId],
  );

  return (
    <List>
      {list?.map(({ id, name, type, config }) => {
        return (
          <ListItem
            key={name}
            className={classnames({ recycle: true, selected: id === sourceId })}
            onClick={toDetail(id)}
          >
            <header>
              <h4>{name}</h4>
              <span>{type}</span>
            </header>
          </ListItem>
        );
      })}
    </List>
  );
});
