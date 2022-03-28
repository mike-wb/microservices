#!/usr/bin/env zsh

DOCKER=docker
IMAGE_BASE="blog/"
APP_DIRS=("posts" "comments" "query" "moderator" "event-bus" "client")


build_docker() {
    # USAGE: build_docker <app-dir>
    local app_dir=${1}
    echo " - Building docker image: ${IMAGE_BASE}${app_dir}"
    # Build the docker image and tag it with <IMAGE_BASE><app-dir>
    pushd ${app_dir}/ 
    ${DOCKER} build -t ${IMAGE_BASE}${app_dir} .
    popd
}

clean_docker() {
    # USAGE: clean_docker <image-name>
    local image_name=${1}
    local images=$(${DOCKER} images --format "{{.Repository}}:{{.Tag}}" | grep "${image_name}")
    if [[ -n "${images}" ]]; then
        echo " - Removing docker images: ${images}"
        local containers=$(${DOCKER} ps -a --filter "ancestor=${image_name}" --format "{{.Names}}")
        if [[ -n "${containers}" ]]; then
            # Stop the dockers whose image is <image_name>
            ${DOCKER} stop ${containers}
            # Delete the dockers whose image is <image_name>
            ${DOCKER} rm ${containers}
        fi
        # Delete the images that match <image_name>
        ${DOCKER} rmi ${images}
    fi
}

echo "** BUILDING docker images"
for appdir in ${APP_DIRS[@]}; do
    clean_docker "${IMAGE_BASE}${appdir}"
    build_docker "${appdir}"
done
echo "** COMPLETE"
