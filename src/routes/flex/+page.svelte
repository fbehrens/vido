<div class="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item"> <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
      </svg></div>
</div>
<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 10vh;
        border: 3px solid #000;
    }
    .item {
        /* border: 1px solid red; */
        background-color: lightblue;
        padding: 20px;
        margin: 10px;
        flex-grow: 1;
    }
</style>
