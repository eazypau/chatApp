<template>
  <div class="h-screen flex items-center">
    <div class="bg-white py-6 sm:py-8 lg:py-12 flex-1">
      <div class="max-w-screen-lg px-4 md:px-8 mx-auto">
        <div class="grid sm:grid-cols-2 gap-8">
          <!-- content - start -->
          <div class="flex flex-col justify-center items-center sm:items-start md:py-24 lg:py-32">
            <p class="text-indigo-500 text-sm md:text-base font-semibold uppercase mb-4">
              Error 404
            </p>
            <h1 class="text-gray-800 text-2xl md:text-3xl font-bold text-center sm:text-left mb-2">
              Page not found
            </h1>

            <p class="text-gray-500 md:text-lg text-center sm:text-left mb-8">
              The page you’re looking for doesn’t exist.
            </p>

            <a
              href="/"
              class="
                inline-block
                bg-gray-200
                hover:bg-gray-300
                focus-visible:ring
                ring-indigo-300
                text-gray-500
                active:text-gray-700
                text-sm
                md:text-base
                font-semibold
                text-center
                rounded-lg
                outline-none
                transition
                duration-100
                px-8
                py-3
              "
              >Go home</a
            >
          </div>
          <!-- content - end -->

          <!-- image - start -->
          <div class="h-80 md:h-auto bg-gray-100 overflow-hidden shadow-lg rounded-lg relative">
            <img
              src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=600"
              loading="lazy"
              alt="Photo by @heydevn"
              class="w-full h-full object-cover object-center absolute inset-0"
            />
          </div>
          <!-- image - end -->
        </div>
      </div>
    </div>
  </div>
</template>
