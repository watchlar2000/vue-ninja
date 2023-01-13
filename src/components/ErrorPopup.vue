<template>
  <div class="absolute bottom-4 left-4 bg-red-500 text-white rounded">
    <div class="m-auto">
      <div class="shadow-md p-4 flex flex-row rounded-lg">
        <p class="p-1">
          <slot></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPopup"
};
</script>
