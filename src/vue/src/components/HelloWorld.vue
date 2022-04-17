<template>
    <div class="hello">
        sup
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        msg: String,
    },
})
export default class HelloWorld extends Vue {
    msg!: string;
    mounted() {
        console.log(this.msg);
    }
}
</script>
