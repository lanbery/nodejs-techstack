import createFromIconfontCN from '@ant-design/icons/es/components/IconFont'
const basePath = __PUBLIC_PATH__ ? __PUBLIC_PATH__ : ''
const BraveIcon = createFromIconfontCN({
  extraCommonProps: {
    className: 'brave-icon',
  },
  scriptUrl: basePath
    ? basePath + 'js/brave-font.min.js'
    : '/js/brave-font.min.js',
})

export default BraveIcon
