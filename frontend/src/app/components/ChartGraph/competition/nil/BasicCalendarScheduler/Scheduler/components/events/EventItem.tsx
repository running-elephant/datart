import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import {
  ButtonBase,
  Paper,
  Popover,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { format } from 'date-fns';
import { Fragment, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { ProcessedEvent } from '../../types';

interface EventItemProps {
  event: ProcessedEvent;
  multiday: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const EventItem = ({
  event,
  multiday,
  hasPrev,
  hasNext,
  showdate,
}: EventItemProps) => {
  const {
    triggerDialog,
    onDelete,
    events,
    handleState,
    triggerLoading,
    viewerExtraComponent,
    fields,
    direction,
    resources,
    resourceFields,
    locale,
    viewerTitleComponent,
  } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();

  const NextArrow =
    direction === 'rtl' ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow =
    direction === 'rtl' ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const triggerViewer = (el?: Element) => {
    if (!el && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el || null);
  };

  const handleConfirmDelete = async () => {
    try {
      triggerLoading(true);
      let deletedId = event.event_id;
      // Trigger custom/remote when provided
      if (onDelete) {
        const remoteId = await onDelete(deletedId);
        if (remoteId) {
          deletedId = remoteId;
        } else {
          deletedId = '';
        }
      }
      if (deletedId) {
        const updatedEvents = events.filter(e => e.event_id !== deletedId);
        handleState(updatedEvents, 'events');
        triggerViewer();
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };

  let item = (
    <div style={{ padding: 2 }}>
      <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
        {event.title}
      </Typography>
      {showdate && (
        <Typography style={{ fontSize: 11 }} noWrap>
          {`${format(event.start, 'hh:mm a', {
            locale: locale,
          })} - ${format(event.end, 'hh:mm a', { locale: locale })}`}
        </Typography>
      )}
    </div>
  );

  if (multiday) {
    item = (
      <div
        style={{
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasPrev ? (
            <PrevArrow fontSize="small" sx={{ display: 'flex' }} />
          ) : (
            showdate && format(event.start, 'hh:mm a', { locale: locale })
          )}
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontSize: 12 }}
          noWrap
        >
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: 11 }} noWrap>
          {hasNext ? (
            <NextArrow fontSize="small" sx={{ display: 'flex' }} />
          ) : (
            showdate && format(event.end, 'hh:mm a', { locale: locale })
          )}
        </Typography>
      </div>
    );
  }

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter(res =>
      Array.isArray(event[idKey])
        ? event[idKey].includes(res[idKey])
        : res[idKey] === event[idKey],
    );
    return (
      <div>
        <div>
          {viewerTitleComponent instanceof Function ? (
            viewerTitleComponent(event)
          ) : (
            <Typography style={{ padding: '5px 0' }} noWrap>
              {event.title}
            </Typography>
          )}
        </div>
        <div style={{ padding: '5px 10px' }}>
          <Typography
            style={{ display: 'flex', alignItems: 'center' }}
            color="textSecondary"
            variant="caption"
            noWrap
          >
            <EventNoteRoundedIcon />{' '}
            {`${format(event.start, 'yyyy/MM/dd  hh:mm a', {
              locale: locale,
            })} - ${format(event.end, 'yyyy/MM/dd  hh:mm a', {
              locale: locale,
            })}`}
          </Typography>
          {Object.keys(event)
            .filter(k => !['event_id', 'start', 'end', 'color'].includes(k))
            .map(key => (
              <Typography
                style={{ display: 'flex', alignItems: 'center' }}
                color="textSecondary"
                variant="caption"
                noWrap
              >
                {' '}
                {key} {': '}
                {event[key]}
              </Typography>
            ))}
          {hasResource.length > 0 && (
            <Typography
              style={{ display: 'flex', alignItems: 'center' }}
              color="textSecondary"
              variant="caption"
              noWrap
            >
              <SupervisorAccountRoundedIcon />{' '}
              {hasResource.map(res => res[resourceFields.textField]).join(', ')}
            </Typography>
          )}
          {viewerExtraComponent instanceof Function
            ? viewerExtraComponent(fields, event)
            : viewerExtraComponent}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Paper
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: event.disabled
            ? '#d0d0d0'
            : event.color || theme.palette.primary.main,
          color: event.disabled
            ? '#808080'
            : theme.palette.primary.contrastText,
          cursor: event.disabled ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
        }}
      >
        <LightTooltip title={renderViewer()}>
          <ButtonBase
            // onClick={e => {
            //   e.preventDefault();
            //   e.stopPropagation();
            //   triggerViewer(e.currentTarget);
            // }}
            disabled={event.disabled}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          >
            <div
              style={{
                height: '100%',
              }}
              draggable
              onDragStart={e => {
                e.stopPropagation();
                e.dataTransfer.setData('text/plain', `${event.event_id}`);
                e.currentTarget.style.backgroundColor =
                  theme.palette.error.main;
              }}
              onDragEnd={e => {
                e.currentTarget.style.backgroundColor =
                  event.color || theme.palette.primary.main;
              }}
              onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDragEnter={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {item}
            </div>
          </ButtonBase>
        </LightTooltip>
      </Paper>

      {/* Viewer */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={e => {
          triggerViewer();
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {renderViewer()}
      </Popover>
    </Fragment>
  );
};

EventItem.defaultProps = {
  multiday: false,
  showdate: true,
};

export default EventItem;
