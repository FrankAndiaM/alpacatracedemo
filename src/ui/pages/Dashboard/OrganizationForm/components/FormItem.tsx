import React from 'react';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import { Box, Icon, Divider } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import TypeItem from './TypeItem';

type FormItemProps = {
  index: number;
  position: number;
  attribute: OrganizationFormAttribute;
  sx?: any;
  onClick(e: any): void;
  onDelete(): void;
  onDuplicate(): void;
  currentIndex: number;
};

const FormItem: React.FC<FormItemProps> = (props: FormItemProps) => {
  const { attribute, onClick, onDelete, onDuplicate, index, position, currentIndex, ...rest }: FormItemProps = props;
  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided: any) => (
        <Box
          px={1}
          pt={2}
          onClick={onClick}
          ref={provided?.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bgcolor={
            currentIndex === index && attribute.attribute_type === 'title'
              ? '#38C57E'
              : attribute.attribute_type === 'title' && '#CDF1DF'
          }
        >
          {attribute.name !== '' ? (
            <>
              {attribute.attribute_type === 'title' ? (
                <></>
              ) : (
                <Box>
                  {position}. {attribute.name}
                </Box>
              )}
            </>
          ) : attribute.attribute_type !== 'title' ? (
            <Box sx={{ color: 'red' }}>{position}. Sin pregunta</Box>
          ) : (
            <>Título de la sección</>
          )}
          {attribute.attribute_type !== 'title' && <Divider sx={attribute.name === '' ? { background: 'red' } : {}} />}
          <Box display="flex" justifyContent="space-between" py={1.2} px={1.2} {...rest}>
            {attribute.attribute_type === 'title' ? (
              <Box fontWeight={700}>{attribute.name}</Box>
            ) : (
              <TypeItem type={attribute.attribute_type} />
            )}
            <Box display="flex">
              {attribute.is_delete !== false && (
                <>
                  <Icon onClick={onDelete} sx={{ cursor: 'pointer' }}>
                    delete
                  </Icon>
                  <Icon onClick={onDuplicate} sx={{ cursor: 'pointer' }}>
                    filter_none
                  </Icon>
                </>
              )}
            </Box>
          </Box>
          <Divider sx={attribute.name === '' ? { background: 'red' } : {}} />
        </Box>
      )}
    </Draggable>
  );
};

export default FormItem;
