import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import classnames from 'classnames';
import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { errorHandle } from 'utils/utils';
import { List, ListItem } from '.';
import { selectSourceListLoading } from '../slice/selectors';
import { getSources } from '../slice/thunks';
import { Source } from '../slice/types';

interface SourceListProps {
  sourceId?: string;
  list?: Source[];
}

export const SourceList = memo(({ sourceId, list }: SourceListProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const listLoading = useSelector(selectSourceListLoading);

  useEffect(() => {
    dispatch(getSources(orgId));
  }, [dispatch, orgId]);

  const toDetail = useCallback(
    id => () => {
      history.push(`/organizations/${orgId}/sources/${id}`);
    },
    [history, orgId],
  );

  const getLabel = useCallback((type: string, config: string) => {
    if (type === 'JDBC') {
      let desc = '';
      try {
        const { dbType } = JSON.parse(config);
        desc = dbType;
      } catch (error) {
        errorHandle(error);
        throw error;
      }
      return desc;
    } else {
      return type;
    }
  }, []);

  return (
    <List>
      {list?.map(({ id, name, type, config }) => {
        const itemClass = classnames({ selected: id === sourceId });
        return (
          <ListItem key={name} className={itemClass} onClick={toDetail(id)}>
            <header>
              <h4>{name}</h4>
              <span>{getLabel(type, config)}</span>
            </header>
          </ListItem>
        );
      })}
    </List>
  );
});
