import React, { FormHTMLAttributes, ReactNode, VFC, useCallback, useMemo } from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { DecoratorsType } from '../../types/props'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Textarea } from '../Textarea'

import { ItemProps, OnClickEdit, RightFixedNoteItem } from './RightFixedNoteItem'
import { useClassNames } from './useClassNames'

type Props = {
  /** コンポーネントのタイトル */
  title: ReactNode
  /** 表示するアイテムの配列 */
  items?: ItemProps[]
  /** submit ボタンのラベル */
  /**
   * @deprecated submitLabel属性は非推奨です。decorators属性を利用してください。
   */
  submitLabel?: string
  /** コンポーネントの幅 */
  width?: number
  /** textarea のラベル */
  textareaLabel?: ReactNode
  /** edit ボタンを押下したときに発火するコールバック関数 */
  onClickEdit: OnClickEdit
  /** submit ボタンを押下したときに発火するコールバック関数 */
  onSubmit: (e: React.FormEvent<HTMLFormElement>, text: string) => void
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'submitLabel'>
}
type ElementProps = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props>

const TEXT_AREA_NAME = 'admin_memo_new_text'
const SUBMIT_LABEL = '送信'

export const RightFixedNote: VFC<Props & ElementProps> = ({
  title,
  items,
  submitLabel,
  decorators,
  width = 270,
  textareaLabel,
  onClickEdit,
  onSubmit,
  className = '',
  ...props
}) => {
  const theme = useTheme()

  const actualSubmitLabel = useMemo(() => {
    if (submitLabel) {
      return submitLabel
    }

    return decorators?.submitLabel?.(SUBMIT_LABEL) || SUBMIT_LABEL
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const newText = (formData.get(TEXT_AREA_NAME) || '') as string

      onSubmit(e, newText)
    },
    [onSubmit],
  )

  const textareaId = useId()
  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      themes={theme}
      $width={width}
      onSubmit={handleSubmit}
      className={`${className} ${classNames.wrapper}`}
    >
      <Title type="sectionTitle" themes={theme} className={classNames.title}>
        {title}
      </Title>

      {items &&
        items.map((item) => (
          <RightFixedNoteItem {...item} key={item.id} onClickEdit={onClickEdit} />
        ))}

      {textareaLabel && (
        <label htmlFor={textareaId}>
          <TextareaLabel tag="span" type="subBlockTitle" themes={theme}>
            {textareaLabel}
          </TextareaLabel>
        </label>
      )}
      <StyledTextarea
        id={textareaId}
        name={TEXT_AREA_NAME}
        themes={theme}
        aria-label={innerText(textareaLabel || title)}
        className={classNames.textarea}
      />

      <SubmitButton type="submit" className={classNames.submitButton}>
        {actualSubmitLabel}
      </SubmitButton>
    </Wrapper>
  )
}

const Wrapper = styled.form<{ themes: Theme; $width: number }>`
  ${({ themes, $width }) => {
    const { spacingByChar, color, shadow } = themes

    return css`
      width: ${$width}px;
      padding: ${spacingByChar(1)};
      background-color: ${color.COLUMN};
      box-shadow: ${shadow.LAYER2};
      overflow: hidden scroll;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
    `
  }}
`

const Title = styled(Heading)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: block;
      margin-bottom: ${spacingByChar(1)};
    `
  }}
`

const TextareaLabel = styled(Heading)<{ themes: Theme }>`
  display: inline-block;
  margin-bottom: ${({ themes }) => themes.spacingByChar(1)};
`

const StyledTextarea = styled(Textarea)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      margin-bottom: ${spacingByChar(1)};
    `
  }}
`

const SubmitButton = styled(Button)`
  display: block;
  float: right;
`
